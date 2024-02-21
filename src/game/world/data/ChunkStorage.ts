import * as THREE from 'three'
import { Chunk } from './Chunk'

export class ChunkStorage {
  public readonly chunks: Map<string, Chunk>

  constructor(public chunkDimensions: THREE.Vector3) {
    this.chunks = new Map()
  }

  getBlock(blockPosition: THREE.Vector3) {
    const chunk = this.getBlockChunk(blockPosition)
    if (!chunk) throw new Error(`Chunk not found for block at ${blockPosition}`)

    const { x, y, z } = blockPosition

    const localPosition = new THREE.Vector3(
      x % this.chunkDimensions.x,
      y % this.chunkDimensions.y,
      z % this.chunkDimensions.z
    )

    return chunk.chunkData.get(localPosition)
  }

  getBlockChunk(blockPosition: THREE.Vector3) {
    return this.getChunk(blockPosition.clone().divide(this.chunkDimensions).floor())
  }

  getChunk(chunkPosition: THREE.Vector3) {
    return this.chunks.get(this.getChunkKey(chunkPosition))
  }

  addChunk(chunk: Chunk) {
    this.chunks.set(this.getChunkKey(chunk.position), chunk)
  }

  getChunkKey(chunkPosition: THREE.Vector3) {
    const { x, y, z } = chunkPosition
    return `${x},${y},${z}`
  }
}
