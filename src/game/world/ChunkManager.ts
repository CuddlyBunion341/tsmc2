import * as THREE from 'three'
import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { TerrainGenerator } from './TerrainGenerator'

export class ChunkManager {
  public readonly chunks: ChunkStorage

  constructor(
    public terrainGenerator: TerrainGenerator,
    public renderDistance: THREE.Vector3,
    chunkSize = new THREE.Vector3(32, 32, 32)
  ) {
    this.chunks = new ChunkStorage(chunkSize)
  }

  public createChunksAroundOrigin(origin: THREE.Vector3) {
    const newChunks: Chunk[] = []

    const { x, y, z } = origin

    const chunkPosition = new THREE.Vector3(0,0,0)

    const chunkDimensions = new THREE.Vector3(
              this.chunks.chunkDimensions.x,
              this.chunks.chunkDimensions.y,
              this.chunks.chunkDimensions.z
            )

    for (let cx = x - this.renderDistance.x; cx <= x + this.renderDistance.x; cx++) {
      for (let cy = y - this.renderDistance.y; cy <= y + this.renderDistance.y; cy++) {
        for (let cz = z - this.renderDistance.z; cz <= z + this.renderDistance.z; cz++) {
          const chunk = this.chunks.getChunk(chunkPosition.set(cx, cy, cz))
          if (chunk) continue
          const newChunk = new Chunk(
            this.terrainGenerator,
            chunkPosition.clone(),
            chunkDimensions
          )
          this.chunks.addChunk(newChunk)
          newChunks.push(newChunk)
        }
      }
    }

    return newChunks
  }

  public getChunksToUnload(origin: THREE.Vector3) {
    const chunksToRemove: Chunk[] = []

    const { x, y, z } = origin

    for (const chunk of this.chunks.chunks.values()) {
      const dx = Math.abs(chunk.position.x - x)
      const dy = Math.abs(chunk.position.y - y)
      const dz = Math.abs(chunk.position.z - z)
      if (
        dx > this.renderDistance.x ||
        dy > this.renderDistance.y ||
        dz > this.renderDistance.z
      ) {
        chunksToRemove.push(chunk)
      }
    }

    return chunksToRemove
  }
}
