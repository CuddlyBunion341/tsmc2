// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback = (args: any) => void

export type WorkerTask = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any
  transferable?: Transferable[]
  callback: Callback
}

export class WorkerManager {
  public idleWorkers: Worker[] = []
  public activeWorkers: Worker[] = []

  public taskQueue: WorkerTask[] = []

  constructor(public readonly scriptUrl: string, public readonly workerCount: number) {
    this.initializeWebWorkers()
  }

  public initializeWebWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(this.scriptUrl, { type: 'module' })
      this.idleWorkers.push(worker)
    }
  }

  public enqueueTask(task: WorkerTask) {
    const { message, callback, transferable } = task

    const idleWorker = this.idleWorkers.pop()

    if (!idleWorker) {
      this.taskQueue.push(task)
      return
    }

    idleWorker.postMessage(message, transferable || [])
    idleWorker.onmessage = (message: unknown) => {
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
