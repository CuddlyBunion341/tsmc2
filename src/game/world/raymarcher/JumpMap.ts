import { Matrix3d } from '../../util/Matrix3d'

const directions = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1]
]

export class JumpMap extends Matrix3d {
  constructor(
    width: number,
    height: number,
    depth: number,
    public voxelData: Uint8Array
  ) {
    super(width, height, depth)
  }

  createEmptyJumpMap() {
    const maxDistance = Math.max(this.width, this.height, this.depth)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          this.set(x, y, z, maxDistance)
        }
      }
    }
  }

  generate() {
    this.createEmptyJumpMap()
    const queue: { x: number; y: number; z: number }[] = []

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          if (this.getBlock(x, y, z) !== 0) this.set(x, y, z, -1)

          this.set(x, y, z, 0)
          queue.push({ x, y, z })
        }
      }
    }

    while (queue.length) {
      const { x, y, z } = queue.pop()!

      directions.forEach(([dx, dy, dz]) => {
        const nx = x + dx
        const ny = y + dy
        const nz = z + dz

        if (
          this.inBounds(nx, ny, nz) &&
          this.getBlock(nx, ny, nz) === 0 &&
          this.get(nx, ny, nz) === 0
        ) {
          this.set(nx, ny, nz, this.get(x, y, z) + 1)
          queue.push({ x: nx, y: ny, z: nz })
        }
      })
    }

    return this.list
  }

  isAdjacentToEmpty(x: number, y: number, z: number) {
    return directions.some(([dx, dy, dz]) => {
      return (
        this.inBounds(x + dx, y + dy, z + dz) &&
        this.getBlock(x + dx, y + dy, z + dz) === 0
      )
    })
  }

  inBounds(x: number, y: number, z: number) {
    return (
      x >= 0 && x < this.width && y >= 0 && y < this.height && z >= 0 && z < this.depth
    )
  }

  getBlock(x: number, y: number, z: number) {
    if (x < 0 || x >= this.width) return 0
    if (y < 0 || y >= this.height) return 0
    if (z < 0 || z >= this.depth) return 0
    return this.voxelData[this.getIndex(x, y, z)]
  }
}
