export class Matrix3d<T> {
  public data: T[]

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    defaultValue?: T
  ) {
    this.data = new Array(width * height * depth).fill(defaultValue)
  }

  get(x: number, y: number, z: number) {
    return this.data[this.getIndex(x, y, z)]
  }

  set(x: number, y: number, z: number, value: T) {
    this.data[this.getIndex(x, y, z)] = value
  }

  getIndex(x: number, y: number, z: number): number {
    return x + this.width * (y + this.height * z)
  }
}
