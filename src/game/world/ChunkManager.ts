import * as THREE from 'three'
import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { TerrainGenerator } from './TerrainGenerator'

export class ChunkManager {
  public readonly chunks: ChunkStorage

  constructor(
    public terrainGenerator: TerrainGenerator,
    public renderDistanceX = 8,
    public renderDistanceY = 2,
    public renderDistanceZ = 8
  ) {
    this.chunks = new ChunkStorage()
  }

  public createChunksAroundOrigin(x: number, y: number, z: number) {
    const newChunks: Chunk[] = []

    for (let cx = x - this.renderDistanceX; cx <= x + this.renderDistanceX; cx++) {
      for (let cy = y - this.renderDistanceY; cy <= y + this.renderDistanceY; cy++) {
        for (let cz = z - this.renderDistanceZ; cz <= z + this.renderDistanceZ; cz++) {
          const chunk = this.chunks.getChunk(cx, cy, cz)
          if (chunk) continue
          const newChunk = new Chunk(
            this.terrainGenerator,
            new THREE.Vector3(cx, cy, cz),
            new THREE.Vector3(32, 32, 32)
          )
          this.chunks.addChunk(newChunk)
          newChunks.push(newChunk)
        }
      }
    }

    return newChunks
  }

  public getChunksToUnload(x: number, y: number, z: number) {
    const chunksToRemove: Chunk[] = []

    for (const chunk of this.chunks.chunks.values()) {
      const dx = Math.abs(chunk.position.x - x)
      const dy = Math.abs(chunk.position.y - y)
      const dz = Math.abs(chunk.position.z - z)
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
