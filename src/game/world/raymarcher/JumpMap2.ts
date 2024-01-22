import { Matrix3d } from '../../util/Matrix3d'

const NEIGHBOR_OFFSET = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1]
]

export class JumpMap2 extends Matrix3d {
  constructor(
    width: number,
    height: number,
    depth: number,
    public voxelData: Uint8Array
  ) {
    super(width, height, depth)
  }

  generate() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          if (this.voxelData[this.getIndex(x, y, z)] === 0) {
            this.set(x, y, z, 1)
            continue
          }
          this.set(x, y, z, -1)

          NEIGHBOR_OFFSET.forEach(([dx, dy, dz]) => {
            if (this.outOfBounds(x + dx, y + dy, z + dz)) return
            this.set(x + dx, y + dy, z + dz, 0)
          })
        }
      }
    }

    return this.list
  }

  private outOfBounds(x: number, y: number, z: number) {
    return x < 0 || x > this.width || y < 0 || y > this.height || z < 0 || z > this.depth
  }
}
