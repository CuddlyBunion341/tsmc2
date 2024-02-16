import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { WorkerManager } from './world/workers/WorkerPool'
import { ChunkMessageData } from './world/Chunk'
import { WaterMaterial } from './world/materials/WaterMaterial'
import { BaseMaterial } from './world/materials/BaseMaterial'

export default class Game implements Experience {
  resources: Resource[] = []

  private readonly waterMaterial: WaterMaterial

  constructor(private engine: Engine) {
    this.waterMaterial = new WaterMaterial()
  }

  @Benchmark
  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const materials = [
      new BaseMaterial(),
      this.waterMaterial,
    ]

    const chunkManager = new ChunkManager({
      terrainGenerator,
      renderDistance: new THREE.Vector3(2,2,2),
      materials: materials.map((material) => material.material)
    })

    const chunks = chunkManager.createChunksAroundOrigin(new THREE.Vector3(0,0,0))

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
    this.waterMaterial.uniforms = {
      uTime: { value: performance.now() / 1000 },
      uFoamThreshold: { value: 0.5 },
      uFoamColor: { value: new THREE.Color(0x0000ff) },
      uWaterColor: { value: new THREE.Color(0x0000ff) },
      uDepthTexture: { value: this.engine.renderEngine.target.instance.depthTexture }
    }
  }

  resize?(): void {}
}
