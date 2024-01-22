import { describe, it, expect } from 'vitest'
import { JumpMap2 } from './JumpMap2'

const jumpMapFromGrid = (grid: number[][][]) => {
  const width = grid[0].length
  const height = grid.length
  const depth = grid[0][0].length

  const buffer = new Uint8Array(width * height * depth)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        const index = x + y * width + z * width * height
        buffer[index] = grid[y][x][z]
      }
    }
  }
  return new JumpMap2(width, height, depth, buffer)
}

const jumpMapToGrid = (jumpMap: JumpMap2) => {
  const grid = new Array(jumpMap.height)
    .fill(0)
    .map(() =>
      new Array(jumpMap.width).fill(0).map(() => new Array(jumpMap.depth).fill(0))
    )

  for (let x = 0; x < jumpMap.width; x++) {
    for (let y = 0; y < jumpMap.height; y++) {
      for (let z = 0; z < jumpMap.depth; z++) {
        grid[y][x][z] = jumpMap.get(x, y, z)
      }
    }
  }

  return grid
}

describe('#generate()', () => {
  it('should set correct neighbor values', () => {
    const jumpMap = jumpMapFromGrid([
      [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ]
    ])

    jumpMap.generate()

    expect(jumpMapToGrid(jumpMap)).toEqual([
      [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, -1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ]
    ])
  })
})
