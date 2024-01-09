import { Chunk } from './Chunk'

export class ChunkManager {
  public readonly chunks: Map<string, Chunk>

  constructor() {
    this.chunks = new Map()
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
