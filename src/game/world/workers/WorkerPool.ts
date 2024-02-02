export interface WorkerTask<T, U> {
  message: T
  transferable?: Transferable[]
  callback: (args: MessageEvent<U>) => void
}

export class WorkerManager<T, U> {
  public idleWorkers: Worker[] = []
  public activeWorkers: Worker[] = []

  public taskQueue: WorkerTask<T, U>[] = []

  constructor(public readonly scriptUrl: string, public readonly workerCount: number) {
    this.initializeWebWorkers()
  }

  public initializeWebWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(this.scriptUrl, { type: 'module' })
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
      requestAnimationFrame(() => {
        this.enqueueTaskFromQueue()
      })
    }

    this.activeWorkers.push(idleWorker)
  }

  public enqueueTaskFromQueue() {
    if (this.taskQueue.length === 0) return

    const task = this.taskQueue.shift()
    if (task) this.enqueueTask(task)
  }
}
