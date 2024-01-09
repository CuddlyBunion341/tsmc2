import { Chunk } from './Chunk'

export class ChunkStorage {
  public readonly chunks: Map<string, Chunk>

  constructor() {
    this.chunks = new Map()
  }

  getBlock(x: number, y: number, z: number) {
    const chunk = this.getBlockChunk(x, y, z)
    if (!chunk) return 0
    return chunk.chunkData.get(x % Chunk.SIZE, y % Chunk.SIZE, z % Chunk.SIZE)
  }

  getBlockChunk(x: number, y: number, z: number) {
    return this.getChunk(
      Math.floor(x / Chunk.SIZE),
      Math.floor(y / Chunk.SIZE),
      Math.floor(z / Chunk.SIZE)
    )
  }

  getChunk(x: number, y: number, z: number) {
    return this.chunks.get(this.getChunkKey(x, y, z))
  }

  setChunk(x: number, y: number, z: number, chunk: Chunk) {
    this.chunks.set(this.getChunkKey(x, y, z), chunk)
  }

  getChunkKey(x: number, y: number, z: number) {
    return `${x},${y},${z}`
  }
}
