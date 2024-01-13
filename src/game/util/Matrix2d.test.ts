import { describe, it, expect } from 'vitest'
import { Matrix2d } from './Matrix2d'

describe('#getIndex()', () => {
  const data = new Matrix2d(32, 32)

  it('should return the correct index for the x axis', () => {
    expect(data.getIndex(0, 0)).toBe(0)
    expect(data.getIndex(1, 0)).toBe(1)
    expect(data.getIndex(2, 0)).toBe(2)
  })

  it('should return the correct index for the y axis', () => {
    expect(data.getIndex(0, 1)).toBe(32)
    expect(data.getIndex(0, 2)).toBe(32 * 2)
    expect(data.getIndex(1, 2)).toBe(32 * 2 + 1)
  })
})

describe('#get(), #set()', () => {
  const data = new Matrix2d(32, 32, 5)
  it('should fill the matrix with the default value', () => {
    expect(data.get(0, 0)).toBe(5)
    expect(data.get(5, 5)).toBe(5)
  })
  it('should return the correct value', () => {
    data.set(0, 0, 1)
    expect(data.get(0, 0)).toBe(1)
  })
})
