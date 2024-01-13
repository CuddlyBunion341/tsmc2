import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { describe, expect, test } from 'vitest'

describe('#getChunkKey()', () => {
  test('should generate the correct key', () => {
    const chunkStorage = new ChunkStorage()
    expect(chunkStorage.getChunkKey(1, 2, 3)).toBe('1,2,3')
  })
})

describe('#getBlockChunk(), #addChunk()', () => {
  test('should return the correct chunk', () => {
    const chunkStorage = new ChunkStorage()
    const chunk = new Chunk(0, 0, 0)
    chunkStorage.addChunk(chunk)

    expect(chunkStorage.getBlockChunk(0, 0, 0)).toBe(chunk)
    expect(chunkStorage.getBlockChunk(31, 31, 31)).toBe(chunk)
    expect(chunkStorage.getBlockChunk(32, 32, 32)).toBe(undefined)
  })
})
