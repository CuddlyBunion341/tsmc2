import { describe, it, expect } from 'vitest'
import { bufferToGrid, gridToBuffer } from './bufferUtils'

describe('bufferToGrid()', () => {
  it('should convert a buffer to a grid', () => {
    const buffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const grid = bufferToGrid(3, 3, 1, buffer)
    expect(grid).toEqual([
      [[1], [2], [3]],
      [[4], [5], [6]],
      [[7], [8], [9]]
    ])
  })
})

describe('gridToBuffer()', () => {
  it('should convert a grid to a buffer', () => {
    const grid = [
      [[1], [2], [3]],
      [[4], [5], [6]],
      [[7], [8], [9]]
    ]
    const buffer = gridToBuffer(grid, Uint8Array)
    expect(buffer).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  })
})
