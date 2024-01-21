import * as THREE from 'three'
import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) {}

  @Benchmark
  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, 0, 1, 0)

    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)

    chunks.forEach((chunk) => {
      chunk.generateData()
      chunk.updateMeshGeometry()
      this.engine.scene.add(chunk.mesh)
      // const helper = new THREE.BoxHelper(chunk.mesh)
      // this.engine.scene.add(helper)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}

  resize?(): void {}
}
