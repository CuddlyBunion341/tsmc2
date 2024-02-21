export interface WorkerTask<T, U> {
  message: T
  transferable?: Transferable[]
  callback: (args: MessageEvent<U>) => void
}

export class WorkerManager<T, U> {

  private idleWorkers: Worker[] = []
  private activeWorkers: Worker[] = []

  private taskQueue: WorkerTask<T, U>[] = []

  constructor(private readonly workerConstructor: new () => Worker, public readonly workerCount: number) {
    this.initializeWebWorkers()
  }

  public initializeWebWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new this.workerConstructor()
      this.idleWorkers.push(worker)
    }
  }

  public enqueueTask(task: WorkerTask<T, U>) {
    const { message, callback, transferable } = task

    const idleWorker = this.idleWorkers.pop()

    if (!idleWorker) {
      this.taskQueue.push(task)
      return
    }

    idleWorker.postMessage(message, transferable || [])
    idleWorker.onmessage = (message: MessageEvent<U>) => {
      callback(message)
      this.idleWorkers.push(idleWorker)
      this.enqueueTaskFromQueue()
    }

    this.activeWorkers.push(idleWorker)
  }

  public enqueueTaskFromQueue() {
    if (this.taskQueue.length === 0) return

    const task = this.taskQueue.shift()
    if (task) this.enqueueTask(task)
  }

  public clearQueue() {
    this.taskQueue = []
  }
}
