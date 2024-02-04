import { Vector3 } from 'three'
import { Matrix3d } from '../../util/Matrix3d'
import { ChunkData } from '../ChunkData'

export class DistanceField extends Matrix3d {
  static sweepDirections = [
    { dx: 1, dy: 0, dz: 0 },
    { dx: -1, dy: 0, dz: 0 },
    { dx: 0, dy: 1, dz: 0 },
    { dx: 0, dy: -1, dz: 0 },
    { dx: 0, dy: 0, dz: 1 },
    { dx: 0, dy: 0, dz: -1 }
  ]

  static readonly directionDimensions = {
    dx: 'width',
    dy: 'height',
    dz: 'depth'
  } as const

  constructor(public voxelData: ChunkData, public resolutionFactor: number) {
    super(
      voxelData.width * resolutionFactor,
      voxelData.height * resolutionFactor,
      voxelData.depth * resolutionFactor
    )
    const maxDimension = Math.max(this.width, this.height, this.depth)
    const maxFieldValue = 255
    if (resolutionFactor * maxDimension >= maxFieldValue) {
      throw new Error('Resolution factor is too high')
    }
  }

  calculateDistanceField() {
    this.fill(255)

    const directionVector = new Vector3(0, 0, 1)
    const dimensionVector = new Vector3(this.width, this.height, this.depth)

    for (let y = 0; y < dimensionVector.y; y++) {
      for (let x = 0; x < dimensionVector.x; x++) {
        let steps = 0
        for (let z = 0; z < dimensionVector.z; z++) {
          const empty = this.isVoxelEmpty(x, y, z)
          const onEdge = z == dimensionVector.z - 1

          if (empty && !onEdge) {
            steps++
            continue
          }

          for (let delta = 0; delta <= steps; delta++) {
            const position = directionVector
              .clone()
              .multiplyScalar(-delta)
              .add(new Vector3(x, y, z))
            const value = Math.min(delta, this.get(position.x, position.y, position.z))
            this.set(position.x, position.y, position.z, value)
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
      Math.floor(z / this.resolutionFactor)
    )
  }

  generateTexture(yLevel: number) {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.depth
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Ctx could not be retrieved')

    const y = yLevel * this.resolutionFactor

    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.depth; z++) {
        const value = (this.get(x, y, z) / this.resolutionFactor) * 10
        ctx.fillStyle = `rgba(${value}, ${value}, ${value}, ${value})`
        ctx.fillRect(x, z, 1, 1)
      }
    }

    return canvas.toDataURL()
  }
}
