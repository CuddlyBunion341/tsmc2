import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'

export class ChunkManager {
  public readonly chunks: ChunkStorage

  constructor(
    public renderDistanceX = 8,
    public renderDistanceY = 2,
    public renderDistanceZ = 8
  ) {
    this.chunks = new ChunkStorage()
  }

  public createChunksAroundOrigin(x: number, y: number, z: number) {
    const newChunks = []

    for (
      let cx = x - this.renderDistanceX;
      cx <= x + this.renderDistanceX;
      cx++
    ) {
      for (
        let cy = y - this.renderDistanceY;
        cy <= y + this.renderDistanceY;
        cy++
      ) {
        for (
          let cz = z - this.renderDistanceZ;
          cz <= z + this.renderDistanceZ;
          cz++
        ) {
          const chunk = this.chunks.getChunk(cx, cy, cz)
          if (chunk) continue
          const newChunk = new Chunk(cx, cy, cz)
          this.chunks.addChunk(newChunk)
          newChunks.push(newChunk)
        }
      }
    }

    return newChunks
  }

  public getChunksToUnload(x: number, y: number, z: number) {
    const chunksToRemove = []

    for (const chunk of this.chunks.chunks.values()) {
      const dx = Math.abs(chunk.x - x)
      const dy = Math.abs(chunk.y - y)
      const dz = Math.abs(chunk.z - z)
      if (
        dx > this.renderDistanceX ||
        dy > this.renderDistanceY ||
        dz > this.renderDistanceZ
      ) {
        chunksToRemove.push(chunk)
      }
    }

    return chunksToRemove
  }
}
