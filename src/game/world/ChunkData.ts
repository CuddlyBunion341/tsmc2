import { Matrix3d } from '../util/Matrix3d'

export class ChunkData {
  public readonly data: Matrix3d<number>

  constructor(
    public readonly width: number = 32,
    public readonly height: number = 32,
    public readonly depth: number = 32
  ) {
    // use a 1 block border around the chunk to avoid using neighbor references
    // this results in 2 extra blocks in each dimension
    this.data = new Matrix3d(width + 2, height + 2, depth + 2, 0)
  }

  get(x: number, y: number, z: number): number {
    return this.data.get(x + 1, y + 1, z + 1)
  }

  set(x: number, y: number, z: number, value: number): void {
    this.data.set(x + 1, y + 1, z + 1, value)
  }
}
