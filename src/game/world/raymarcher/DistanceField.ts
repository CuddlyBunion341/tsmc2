import { Matrix3d } from "../../util/Matrix3d"

export class DistanceField extends Matrix3d {
  static sweepDirections = [
    { dx: 1, dy: 0, dz: 0 },
    { dx: -1, dy: 0, dz: 0 },
    { dx: 0, dy: 1, dz: 0 },
    { dx: 0, dy: -1, dz: 0 },
    { dx: 0, dy: 0, dz: 1 },
    { dx: 0, dy: 0, dz: -1 },
  ]

  constructor(public voxelData: Matrix3d, public resolutionFactor: number, public yLevel: number) {
    super(voxelData.width * resolutionFactor, voxelData.height * resolutionFactor, voxelData.depth * resolutionFactor)
  }

  calculateDistanceField() {
    // this.fill(Math.min(this.width, this.height, this.depth) * this.resolutionFactor)

    const y = this.yLevel * this.resolutionFactor

    for (let z = 0; z < this.depth; z++) {
      let steps = 0
      for (let x = 0; x < this.width; x++) {
        if (this.isVoxelEmpty(x, y, z)) {
          steps++
          this.set(x, y, z, 1)
        } else {
          this.set(x, y, z, 0)
          for (let dx = 0; dx < steps; dx++) {
            this.set(x - dx, y, z, dx)
          }

          steps = 0
        }
      }
    }
  }

  isVoxelEmpty(x: number, y: number, z: number) {
    return this.getVoxelAt(x, y, z) === 0
  }

  getVoxelAt(x: number, y: number, z: number) {
    return this.voxelData.get(
      Math.floor(x / this.resolutionFactor),
      Math.floor(y / this.resolutionFactor),
      Math.floor(z / this.resolutionFactor),
    )
  }


  getTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.depth
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Ctx could not be retrieved')

    const y = this.yLevel * this.resolutionFactor

    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.depth; z++) {
        const value = this.get(x, y, z) / this.resolutionFactor * 10
        ctx.fillStyle = `rgba(${value}, ${value}, ${value}, ${value})`
        ctx.fillRect(x, z, 1, 1)
      }
    }

    return canvas.toDataURL()
  }
}
