import { Matrix3d } from '../../util/Matrix3d'

export class JumpMap extends Matrix3d<Int8Array> {
  constructor(
    width: number,
    height: number,
    depth: number,
    public voxelData: Uint8Array
  ) {
    super(width, height, depth, Int8Array)
  }

  generate() {
    this.fill(1)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          if (this.getBlock(x, y, z) !== 0) continue

          this.set(x, y, z, -1)

          this.updateNeighbors(x, y, z)
        }
      }
    }

    return this.list
  }

  updateNeighbors(x: number, y: number, z: number) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const nx = x + dx
          const ny = y + dy
          const nz = z + dz

          if (dx === 0 && dy === 0 && dz === 0) continue
          if (this.outOfBounds(nx, ny, nz)) continue
          this.set(nx, ny, nz, 0)
        }
      }
    }
  }

  getBlock(x: number, y: number, z: number) {
    const index = this.getIndex(x, y, z)
    return this.voxelData[index]
  }

  private outOfBounds(x: number, y: number, z: number) {
    return (
      x < 0 || x >= this.width || y < 0 || y >= this.height || z < 0 || z >= this.depth
    )
  }
}
