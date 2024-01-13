import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) {}

  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, 4, 2, 4)

    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)

    chunks.forEach((chunk) => {
      chunk.generateData()
      chunk.updateMeshGeometry()
      this.engine.scene.add(chunk.mesh)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}

  resize?(): void {}
}
