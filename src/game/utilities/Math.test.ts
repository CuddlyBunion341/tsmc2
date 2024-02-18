import {describe, expect, test} from 'vitest'
import { linearSplineInterpolation } from './Math'

describe('linearSplineInterpolation()', () => {
  test('should return input values when splinepoints are the same', () => {
    expect(linearSplineInterpolation(0, [[0, 0], [1, 1]])).toBe(0)
  })

  test('should return first splinepoint value', () => {
    expect(linearSplineInterpolation(0, [[0, 0], [1, 1]])).toBe(0)
  })

  test('should return last splinepoint value', () => {
    expect(linearSplineInterpolation(1, [[0, 0], [1, 1]])).toBe(1)
  })

  test('should return interpolated value', () => {
    expect(linearSplineInterpolation(0.5, [[0, 0], [1, 1]])).toBe(0.5)
  })

  test('should return interpolated value for multiple splinepoints', () => {
    const splinePoints = [[0, 0], [1, 1], [2, 4]]
    expect(linearSplineInterpolation(0.5, splinePoints)).toBe(0.5)
    expect(linearSplineInterpolation(1.5, splinePoints)).toBe(2.5)
  })
})
