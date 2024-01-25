import { describe, it, expect } from 'vitest'
import { Matrix3d } from './Matrix3d'

describe('#getIndex()', () => {
  const chunkData = new Matrix3d<Uint8Array>(32, 32, 32, Uint8Array)

  it('should return the correct index for the x axis', () => {
    expect(chunkData.getIndex(0, 0, 0)).toBe(0)
    expect(chunkData.getIndex(1, 0, 0)).toBe(1)
    expect(chunkData.getIndex(2, 0, 0)).toBe(2)
  })

  it('should return the correct index for the y axis', () => {
    expect(chunkData.getIndex(0, 1, 0)).toBe(32)
    expect(chunkData.getIndex(0, 2, 0)).toBe(32 * 2)
    expect(chunkData.getIndex(1, 2, 0)).toBe(32 * 2 + 1)
  })

  it('should return the correct index for the z axis', () => {
    expect(chunkData.getIndex(0, 0, 1)).toBe(32 * 32)
    expect(chunkData.getIndex(0, 0, 2)).toBe(32 * 32 * 2)
    expect(chunkData.getIndex(1, 2, 3)).toBe(32 * 32 * 3 + 32 * 2 + 1)
  })
})

describe('#get(), #set()', () => {
  const chunkData = new Matrix3d<Uint8Array>(32, 32, 32, Uint8Array)
  it('should fill the matrix with the default value', () => {
    expect(chunkData.get(0, 0, 0)).toBe(5)
  })
  it('should return the correct value', () => {
    chunkData.set(0, 0, 0, 1)
    expect(chunkData.get(0, 0, 0)).toBe(1)
  })
})
