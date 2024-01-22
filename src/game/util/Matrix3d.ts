export class Matrix3d<T extends Uint8Array | Int8Array | Float32Array> {
  public readonly list: T

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    TypedArray: new (length: number) => T
  ) {
    this.list = new TypedArray(width * height * depth)
  }

  fill(value: number) {
    this.list.fill(value)
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
