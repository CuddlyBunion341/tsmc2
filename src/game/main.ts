import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { WorkerManager } from './world/workers/WorkerManager'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) { }

  @Benchmark
  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, 8, 2, 8)

    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)

    const workerPath = './src/game/world/workers/TerrainGenerationWorker.ts'
    const workerCount = 10

    const workerManager = new WorkerManager(workerPath, workerCount)

    chunks.forEach((chunk) => {
      chunk.generateData()
      this.engine.scene.add(chunk.mesh)

      const task = chunk.prepareGeneratorWorkerData()

      workerManager.enqueueTask({
        payload: task.payload,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (args: any) => {
          task.callback(args)
          chunk.updateMeshGeometry()
        }
      })
    })

    chunks.forEach((chunk) => {
      setTimeout(() => {
        chunk.updateMeshGeometry()
      }, Math.random())
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void { }

  resize?(): void { }
}
