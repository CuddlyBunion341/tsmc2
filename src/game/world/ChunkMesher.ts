import { blocks } from './blocks'

export class ChunkMesher {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly blockGetter: (x: number, y: number, z: number) => number
  ) {}

  static isSolid(block: number) {
    if (block === 0) return false
    return !blocks[block].transparent
  }

  isSolid(x: number, y: number, z: number) {
    return ChunkMesher.isSolid(this.blockGetter(x, y, z))
  }

  generateMesh() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          const block = this.blockGetter(x, y, z)
          if (!ChunkMesher.isSolid(block)) continue

          let faceMask = 0b000000
          if (this.isSolid(x - 1, y, z)) faceMask |= 0b000001 // 1
          if (this.isSolid(x + 1, y, z)) faceMask |= 0b000010 // 2
          if (this.isSolid(x, y - 1, z)) faceMask |= 0b000100 // 4
          if (this.isSolid(x, y + 1, z)) faceMask |= 0b001000 // 8
          if (this.isSolid(x, y, z - 1)) faceMask |= 0b010000 // 16
          if (this.isSolid(x, y, z + 1)) faceMask |= 0b100000 // 32
          if (faceMask === 0b000000) continue
        }
      }
    }
  }
}
