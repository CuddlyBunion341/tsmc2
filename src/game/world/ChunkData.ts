export class ChunkData {
  public readonly data: number[]

  constructor(
    public readonly width: number = 32,
    public readonly height: number = 32,
    public readonly depth: number = 32
  ) {
    this.data = new Array(width * height * depth).fill(0)
  }

  get(x: number, y: number, z: number): number {
    return this.data[this.getIndex(x, y, z)]
  }

  set(x: number, y: number, z: number, value: number): void {
    this.data[this.getIndex(x, y, z)] = value
  }

  private getIndex(x: number, y: number, z: number): number {
    return x + this.width * (y + this.height * z)
  }
}
