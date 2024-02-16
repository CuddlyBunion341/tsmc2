import * as THREE from 'three'
import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { SpiralHelper2d } from './SpiralHelper2d'
import { TerrainGenerator } from './TerrainGenerator'

export interface ChunkManagerOptions {
  terrainGenerator: TerrainGenerator
  renderDistance: THREE.Vector3
  chunkSize?: THREE.Vector3
  materials: THREE.Material[]
}

export class ChunkManager {
  public readonly chunks: ChunkStorage
  public terrainGenerator: TerrainGenerator
  public renderDistance: THREE.Vector3
  public materials: THREE.Material[]
  public chunkSize: THREE.Vector3

  constructor(
    options: ChunkManagerOptions
  ) {
    const { terrainGenerator, renderDistance, chunkSize, materials } = options

    this.terrainGenerator = terrainGenerator
    this.renderDistance = renderDistance
    this.materials = materials

    this.chunkSize = chunkSize ?? new THREE.Vector3(32, 32, 32)

    this.chunks = new ChunkStorage(this.chunkSize)
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
        const chunk = this.createChunk(chunkPosition)
        this.chunks.addChunk(chunk)
        newChunks.push(chunk)
      }
    })

    return newChunks
  }

  private createChunk(position: THREE.Vector3) {
    return new Chunk({
      position,
      terrainGenerator: this.terrainGenerator,
      dimensions: this.chunks.chunkDimensions,
      materials: this.materials,
    })
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

