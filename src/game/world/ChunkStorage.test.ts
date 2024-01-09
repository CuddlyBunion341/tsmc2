import { ChunkStorage } from './ChunkStorage'
import { describe, expect, test } from 'vitest'

describe('#getChunkKey()', () => {
  test('should generate the correct key', () => {
    const chunkStorage = new ChunkStorage()
    expect(chunkStorage.getChunkKey(1, 2, 3)).toBe('1,2,3')
  })
})
