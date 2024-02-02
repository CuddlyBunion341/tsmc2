import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { WorkerManager } from './world/workers/WorkerPool'
import { ChunkMessageData } from './world/Chunk'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) {}

  @Benchmark
  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, new THREE.Vector3(8, 2, 8))

    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)

    const workerPath = './src/game/world/workers/TerrainGenerationWorker.ts'
    const workerCount = navigator.hardwareConcurrency

    const workerManager = new WorkerManager<ChunkMessageData, ArrayBuffer>(
      workerPath,
      workerCount
    )

    chunks.forEach((chunk) => {
      this.engine.scene.add(chunk.mesh)

      const task = chunk.generateWorkerTask()

      workerManager.enqueueTask({
        message: task.message,
        callback: (args: MessageEvent<ArrayBuffer>) => {
          task.callback(args)
          requestAnimationFrame(() => chunk.updateMeshGeometry())
        }
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}

  resize?(): void {}
}
