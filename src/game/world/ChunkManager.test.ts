import { describe, it, expect } from 'vitest'
import { ChunkManager } from './ChunkManager'
import { TerrainGenerator } from './TerrainGenerator'

describe('#createChunksAroundOrigin()', () => {
  it('should create the correct amount of chunks', () => {
    const chunkManager = new ChunkManager(new TerrainGenerator(0), 1, 1, 1)
    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)
    expect(chunks).toHaveLength(27)
  })
})

describe('#getChunksToUnload()', () => {
  it('should return no chunks if all are within render distance', () => {
    const chunkManager = new ChunkManager(new TerrainGenerator(0), 1, 1, 1)
    chunkManager.createChunksAroundOrigin(0, 0, 0)
    const chunksToUnload = chunkManager.getChunksToUnload(0, 0, 0)
    expect(chunksToUnload).toHaveLength(0)
  })

  it('should return the correct chunks to unload', () => {
    const chunkManager = new ChunkManager(new TerrainGenerator(0), 1, 1, 1)
    chunkManager.createChunksAroundOrigin(0, 0, 0)
    const chunksToUnload = chunkManager.getChunksToUnload(1, 0, 0)
    expect(chunksToUnload).toHaveLength(9)
  })
})
