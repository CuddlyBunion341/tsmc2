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

  constructor(public voxelData: Matrix3d, public resolutionFactor: number) {
    super(voxelData.width * resolutionFactor, voxelData.height * resolutionFactor, voxelData.depth * resolutionFactor)
  }

  calculateDistanceField() {
    this.fill(Math.min(this.width, this.height, this.depth) * this.resolutionFactor)

    // DistanceField.sweepDirections.forEach(direction => {
    //   const { dx, dy, dz } = direction
    // })

    const y = 16

    let steps = 0
    for (let z = 0; z < this.depth; z++) {
      for (let x = 0; x < this.width; x++) {
        steps++

        if (this.isVoxelEmpty(x, y, z)) {
          // TODO: fix
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
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Ctx could not be retrieved')

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          const value = this.get(x, y, z)
          ctx.fillStyle = `rgba(${value}, ${value}, ${value})`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    return canvas.toDataURL()
  }
}
