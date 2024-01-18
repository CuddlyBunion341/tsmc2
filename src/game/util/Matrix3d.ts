export const VOXEL_BYTE_SIZE = 1

export class Matrix3d {
  public readonly list: ArrayBuffer
  public readonly dataView: DataView

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number
  ) {
    this.list = new ArrayBuffer(width * height * depth * VOXEL_BYTE_SIZE)
    this.dataView = new DataView(this.list)
  }

  get(x: number, y: number, z: number) {
    // Uint8 because of VOXEL_BYTE_SIZE = 1
    return this.dataView.getUint8(this.getIndex(x, y, z))
  }

  set(x: number, y: number, z: number, value: number) {
    this.dataView.setUint8(this.getIndex(x, y, z), value)
  }

  getIndex(x: number, y: number, z: number): number {
    return x + this.width * (y + this.height * z)
  }
}
