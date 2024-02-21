import * as THREE from 'three'
import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { SpiralHelper2d } from './SpiralHelper2d'
import type { TerrainGenerator } from './TerrainGenerator'

export class ChunkManager {
  private readonly chunks: ChunkStorage

  public constructor(
    public terrainGenerator: TerrainGenerator,
    public renderDistance: THREE.Vector3,
    chunkSize = new THREE.Vector3(32, 32, 32)
  ) {
    this.chunks = new ChunkStorage(chunkSize)
  }

  public createChunksAroundOrigin(origin: THREE.Vector3) {
    const { x, y, z } = origin

    const newChunks: Chunk[] = []

    const spiralRadius = Math.min(this.renderDistance.x, this.renderDistance.z)

    const spiral = new SpiralHelper2d(spiralRadius)
    const positions = spiral.generateSpiral()

    positions.forEach(position => {
      for (let columnY = y - this.renderDistance.y; columnY <= y + this.renderDistance.y; columnY++) {
        const chunkPosition = new THREE.Vector3(position.x + x, columnY, position.y + z)
        const chunk = new Chunk(this.terrainGenerator, chunkPosition, this.chunks.chunkDimensions)
        this.chunks.addChunk(chunk)
        newChunks.push(chunk)
      }
    })

    return newChunks
  }

  public getChunksToUnload(origin: THREE.Vector3) {
    const chunksToRemove: Chunk[] = []

    const { x, y, z } = origin

    for (const chunk of this.chunks.chunks.values()) {
      const distance = new THREE.Vector3(
        Math.abs(chunk.position.x - x),
        Math.abs(chunk.position.y - y),
        Math.abs(chunk.position.z - z)
      )
      if (
        distance.x > this.renderDistance.x ||
        distance.y > this.renderDistance.y ||
        distance.z > this.renderDistance.z
      ) {
        chunksToRemove.push(chunk)
      }
    }

    return chunksToRemove
  }
}
