export type WorkerTask = {
  payload: unknown
  callback: (args: unknown) => void
}

export class WorkerManager {
  public idleWorkers: Worker[] = []
  public activeWorkers: Worker[] = []

  public taskQueue: WorkerTask[] = []

  constructor(public readonly scriptUrl: string, public readonly workerCount: number) {}

  public initializeWebWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(this.scriptUrl)
      this.idleWorkers.push(worker)
    }
  }

  public enqueueTask(task: WorkerTask) {
    const { payload, callback } = task

    const idleWorker = this.idleWorkers.pop()

    if (!idleWorker) {
      this.taskQueue.push(task)
      return
    }

    idleWorker.postMessage(payload)
    idleWorker.onmessage = (message: unknown) => {
      callback(message)
      this.idleWorkers.push(idleWorker)
    }

    this.activeWorkers.push(idleWorker)
  }
}
