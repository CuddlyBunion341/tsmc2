import { TypedArray } from 'three'

export class VoxelGrid {
  public data: TypedArray

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    defaultValue: number = 0
  ) {
    this.data = new Uint8Array(width * height * depth).fill(defaultValue)
  }

  get(x: number, y: number, z: number) {
    return this.data[this.getIndex(x, y, z)]
  }

  set(x: number, y: number, z: number, value: number) {
    this.data[this.getIndex(x, y, z)] = value
  }

  getIndex(x: number, y: number, z: number): number {
    return x + this.width * (y + this.height * z)
  }
}
