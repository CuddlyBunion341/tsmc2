import { describe, it, expect } from 'vitest'
import { ChunkData } from './ChunkData'

describe('#constructor()', () => {
  const chunkData = new ChunkData(1, 2, 3)

  it('should create a matrix with the correct dimensions', () => {
    expect(chunkData.data.width).toEqual(3)
    expect(chunkData.data.height).toEqual(4)
    expect(chunkData.data.depth).toEqual(5)
  })
})

describe('#get()', () => {
  const chunkData = new ChunkData(32, 32, 32)

  it('calls the VoxelGrid method with correct params', () => {
    chunkData.data.set(1, 2, 3, 4)
    expect(chunkData.get(0, 1, 2)).toEqual(4)
  })
})

describe('#set()', () => {
  const chunkData = new ChunkData(32, 32, 32)

  it('calls the VoxelGrid method with correct params', () => {
    chunkData.set(0, 1, 2, 5)
    expect(chunkData.data.get(1, 2, 3)).toEqual(5)
  })
})
