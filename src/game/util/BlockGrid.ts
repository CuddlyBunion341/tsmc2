export class BlockGrid<T> {
  public readonly data: T[]

  public constructor(
    public readonly width: number,
    public readonly height: number,
    defaultValue?: T
  ) {
    this.data = Array(width * height).fill(defaultValue)
  }

  public getIndex(x: number, y: number) {
    return x + this.width * y
  }

  public get(x: number, y: number) {
    return this.data[this.getIndex(x, y)]
  }

  public set(x: number, y: number, value: T) {
    this.data[this.getIndex(x, y)] = value
  }
}
