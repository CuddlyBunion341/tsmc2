import * as THREE from 'three'
import { blocks } from './blocks'

export class ChunkMesher {
  static vertexData = [
    // left
    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },

    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    // right
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },

    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
    // back
    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },

    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
    // front
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },

    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] },
    // bottom
    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },

    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] },
    // top
    { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },

    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] }
  ] as const

  static vertexIndices = [
    [0, 1, 2, 3, 4, 5], // left
    [6, 7, 8, 9, 10, 11], // right
    [12, 13, 14, 15, 16, 17], // back
    [18, 19, 20, 21, 22, 23], // front
    [24, 25, 26, 27, 28, 29], // bottom
    [30, 31, 32, 33, 34, 35] // top
  ] as const

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

  generateVertexData() {
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

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

          for (let i = 0; i < 6; i++) {
            if ((faceMask & (1 << i)) === 0) continue
          }
        }
      }
    }

    return { positions, normals, uvs, indices }
  }

  generateMesh() {
    const { positions, normals, uvs, indices } = this.generateVertexData()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    )
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), 3)
    )
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    )
    geometry.setIndex(indices)

    const mesh = new THREE.Mesh()
  }
}
