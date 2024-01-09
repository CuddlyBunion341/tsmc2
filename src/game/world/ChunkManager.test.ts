import { ChunkManager } from './ChunkManager'
import { describe, expect, test } from 'vitest'

describe('#getChunkKey()', () => {
  test('should generate the correct key', () => {
    const chunkManager = new ChunkManager()
    expect(chunkManager.getChunkKey(1, 2, 3)).toBe('1,2,3')
  })
})
