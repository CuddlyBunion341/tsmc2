export class Matrix3d {
  public readonly list: Uint8Array

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number
  ) {
    this.list = new Uint8Array(width * height * depth)
  }

  get(x: number, y: number, z: number) {
    return this.list[this.getIndex(x, y, z)]
  }

  set(x: number, y: number, z: number, value: number) {
    this.list[this.getIndex(x, y, z)] = value
  }

  getIndex(x: number, y: number, z: number): number {
    return x + this.width * (y + this.height * z)
  }
}
