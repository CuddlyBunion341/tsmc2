import { expect, test, describe } from "vitest";
import { SpiralHelper2d } from "./SpiralHelper2d";

describe('#generateSpiral()', () => {
  const helper = new SpiralHelper2d(1)
  const positions = helper.generateSpiral()

  test('should generate correct positions', () => {
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
})
