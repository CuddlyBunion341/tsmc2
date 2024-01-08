import { describe, it, expect } from 'vitest'
import { ChunkData } from './ChunkData'

describe('#getIndex()', () => {
  const chunkData = new ChunkData(32, 32, 32)
  it('should return the correct index for the x axis', () => {
    expect(chunkData.getIndex(-1, -1, -1)).toBe(0)
    expect(chunkData.getIndex(0, -1, -1)).toBe(1)
    expect(chunkData.getIndex(1, -1, -1)).toBe(2)
  })
  it('should return the correct index for the y axis', () => {
    expect(chunkData.getIndex(-1, 0, -1)).toBe(34)
  })
  it('should return the correct index for the z axis', () => {
    expect(chunkData.getIndex(-1, -1, 0)).toBe(34 * 34)
  })
})
