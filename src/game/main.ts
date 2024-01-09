import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { ChunkManager } from './world/ChunkManager'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) {}

  init(): void {
    const chunkManager = new ChunkManager()
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
