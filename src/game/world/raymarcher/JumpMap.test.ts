import { describe, it, expect } from 'vitest'
import { JumpMap } from './JumpMap'

const jumpMapToGrid = (jumpMap: JumpMap) => {
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

describe('#updateNeighbors()', () => {
  it('should update the neighbors', () => {
    const jumpMap = new JumpMap(3, 1, 3, new Uint8Array(9))
    jumpMap.list.fill(2)
    jumpMap.set(1, 0, 1, 1)

    jumpMap.updateNeighbors(1, 0, 1)

    expect(jumpMapToGrid(jumpMap)).toEqual([
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ]
    ])
  })
})

describe('#generate()', () => {
  it('should generate correct jumpMap', () => {
    const jumpMap = new JumpMap(5, 1, 5, new Uint8Array(25))
    jumpMap.getBlock = (x, y, z) => {
      if (x === 2 && y === 0 && z === 2) return 0
      return 1
    }

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
