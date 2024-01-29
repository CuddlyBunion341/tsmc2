import { expect, test, describe } from "vitest";
import { SpiralHelper2d } from "./SpiralHelper2d";

describe('#generateSpiral()', () => {
  test('should generate correct amount of positions', () => {
    for (let radius = 0; radius < 10; radius++) {
      const helper = new SpiralHelper2d(radius)
      const positions = helper.generateSpiral()

      const sideLength = radius * 2 + 1
      expect(positions.length).toEqual(sideLength * sideLength)
    }
  })

  test('should return origin when radius < 1', () => {
    const helper = new SpiralHelper2d(0)
    const positions = helper.generateSpiral()
    expect(positions).toEqual([{ x: 0, y: 0 }])
  })

  test('should generate correct positions for a small spiral', () => {
    const helper = new SpiralHelper2d(1)
    const positions = helper.generateSpiral()

    expect(positions).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ])
  })

  test('should generate correct positions for bigger spirals', () => {
    const helper = new SpiralHelper2d(2)
    const positions = helper.generateSpiral()

    expect(positions.slice(9)).toEqual([
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 2, y: -1 },
      { x: 2, y: -2 },
      { x: 1, y: -2 },
      { x: 0, y: -2 },
      { x: -1, y: -2 },
      { x: -2, y: -2 },
      { x: -2, y: -1 },
      { x: -2, y: 0 },
      { x: -2, y: 1 },
      { x: -2, y: 2 },
      { x: -1, y: 2 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ])
  })
})
