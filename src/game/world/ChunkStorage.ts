import * as THREE from 'three'
import type { Chunk } from './Chunk'

export class ChunkStorage {
  private readonly chunks: Map<string, Chunk>

  public constructor(public chunkDimensions: THREE.Vector3) {
    this.chunks = new Map()
  }


  private static getChunkKey(chunkPosition: THREE.Vector3) {
    const { x, y, z } = chunkPosition
    return `${x},${y},${z}`
  }

  public getBlock(blockPosition: THREE.Vector3) {
    const chunk = this.getBlockChunk(blockPosition)
    if (!chunk) throw new Error(`Chunk not found for block at ${blockPosition.toArray().join(',')}`)

    const { x, y, z } = blockPosition

    const localPosition = new THREE.Vector3(
      x % this.chunkDimensions.x,
      y % this.chunkDimensions.y,
      z % this.chunkDimensions.z
    )

    return chunk.chunkData.get(localPosition)
  }

  public getBlockChunk(blockPosition: THREE.Vector3) {
    return this.getChunk(blockPosition.clone().divide(this.chunkDimensions).floor())
  }

  public getChunk(chunkPosition: THREE.Vector3) {
    return this.chunks.get(ChunkStorage.getChunkKey(chunkPosition))
  }

  public addChunk(chunk: Chunk) {
    this.chunks.set(ChunkStorage.getChunkKey(chunk.position), chunk)
  }
}
