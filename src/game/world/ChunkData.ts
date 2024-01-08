export class ChunkData {
  public readonly data: number[]

  constructor(
    public readonly width: number = 32,
    public readonly height: number = 32,
    public readonly depth: number = 32
  ) {
    // use a 1 block border around the chunk to avoid using neighbor references
    // this results in 2 extra blocks in each dimension
    this.data = new Array((width + 2) * (height + 2) * (depth + 2)).fill(0)
  }

  get(x: number, y: number, z: number): number {
    return this.data[this.getIndex(x, y, z)]
  }

  set(x: number, y: number, z: number, value: number): void {
    this.data[this.getIndex(x, y, z)] = value
  }

  getIndex(x: number, y: number, z: number): number {
    // add 1 to each coordinate to account for the border
    // add 2 to the width and height to account for the border
    return x + 1 + (this.width + 2) * (y + 1 + (this.height + 2) * (z + 1))
  }
}
