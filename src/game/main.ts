import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { WorkerManager } from './world/workers/WorkerPool'
import { ChunkMessageData } from './world/Chunk'
import { InstancedOakLeaves } from './world/InstancedOakLeaves'

export default class Game implements Experience {
  resources: Resource[] = []

  public oakLeaves!: InstancedOakLeaves

  constructor(private engine: Engine) {}

  @Benchmark
  init(): void {
    this.addOakLeaves()

    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, new THREE.Vector3(8, 2, 8))

    const chunks = chunkManager.createChunksAroundOrigin(new THREE.Vector3(0, 0, 0))

    const workerPath = './src/game/world/workers/TerrainGenerationWorker.ts'
    const workerCount = navigator.hardwareConcurrency

    const workerManager = new WorkerManager<ChunkMessageData, ArrayBuffer>(
      workerPath,
      workerCount
    )

    chunks.forEach((chunk) => {
      this.engine.scene.add(chunk.mesh)

      const task = chunk.generateTerrainGenerationWorkerTask()

      workerManager.enqueueTask({
        message: task.message,
        callback: (args: MessageEvent<ArrayBuffer>) => {
          task.callback(args)
          chunk.updateMeshGeometry()
        }
      })
    })
  }

  addOakLeaves() {
    const oakLeaves = new InstancedOakLeaves()
    this.oakLeaves = oakLeaves
    this.engine.scene.add(oakLeaves.frontSideMesh)
    this.engine.scene.add(oakLeaves.backSideMesh)

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        for (let z = 0; z < 10; z++) {
          oakLeaves.createInstance(new THREE.Vector3(x * 1, y * 1, z * 1))
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
    this.oakLeaves.sortInstances(this.engine.camera.instance)
  }

  resize?(): void {}
}
