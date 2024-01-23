import { Matrix3d } from '../../util/Matrix3d'

export class StupidJumpMap extends Matrix3d<Uint8Array> {
  constructor(width: number, height: number, depth: number, public voxels: Uint8Array) {
    super(width, height, depth, Uint8Array)
  }

  generate() {
    this.fill(255)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          if (this.getBlock(x, y, z) === 0) {
            this.set(x, y, z, this.getClosestVoxel(x, y, z))
          } else {
            this.set(x, y, z, 0)
          }
        }
      }
    }

    return this.list
  }

  getClosestVoxel(vx: number, vy: number, vz: number) {
    let min = 255

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          if (this.getBlock(x, y, z) === 0) continue

          const dx = x - vx
          const dy = y - vy
          const dz = z - vz

          const distance = Math.cbrt(dx * dx + dy * dy + dz * dz)

          if (distance === 1) return 1

          if (distance < min) {
            min = distance
          }
        }
      }
    }

    return min
  }

  private getBlock(x: number, y: number, z: number) {
    const index = this.getIndex(x, y, z)
    return this.voxels[index]
  }
}
