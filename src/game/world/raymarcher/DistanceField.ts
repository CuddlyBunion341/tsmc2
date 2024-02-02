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

  static readonly directionDimensions = {
    dx: 'width',
    dy: 'height',
    dz: 'depth',
  } as const

  constructor(public voxelData: Matrix3d, public resolutionFactor: number) {
    super(voxelData.width * resolutionFactor, voxelData.height * resolutionFactor, voxelData.depth * resolutionFactor)
  }

  calculateDistanceField() {
    // this.fill(Math.min(this.width, this.height, this.depth) * this.resolutionFactor)

    DistanceField.sweepDirections.forEach((direction) => {
      const { dx, dy, dz } = direction

      const constructLoop = (key: keyof typeof direction, callback: (value: number) => void) => {
        const maxValue = this[DistanceField.directionDimensions[key]]

        if (direction[key] === -1) {
          for (let i = maxValue; i >= 0; i--) callback(i)
        } else {
          for (let i = 0; i < maxValue; i++) callback(i)
        }
      }

      constructLoop('dx', (x: number) => {
        constructLoop('dy', (y: number) => {
          let steps = 0
          constructLoop('dz', (z: number) => {
            if (this.isVoxelEmpty(x, y, z)) {
              steps++
              this.set(x, y, z, 1)
            } else {
              this.set(x, y, z, 0)
              for (let dz = 0; dz < steps; dz++) {
                this.set(z - dz, y, z, dz)
              }

              steps = 0
            }
          })
        })
      })
    })
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


  getTexture(yLevel: number) {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.depth
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Ctx could not be retrieved')

    const y = yLevel * this.resolutionFactor

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
