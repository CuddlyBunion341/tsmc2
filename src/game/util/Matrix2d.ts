export class Matrix2d<T> {
  public readonly data: T[]

  constructor(public readonly width: number, public readonly height: number) {
    this.data = Array(width * height).fill(null)
  }

  getIndex(x: number, y: number) {
    return x + this.width * y
  }

  get(x: number, y: number) {
    return this.data[this.getIndex(x, y)]
  }

  set(x: number, y: number, value: T) {
    this.data[this.getIndex(x, y)] = value
  }
}
