import * as THREE from 'three'
import { blocks } from './blocks'

export type Vertex = {
  pos: [number, number, number]
  norm: [number, number, number]
  uv: [number, number]
}

const FACE_COUNT = 6
const FACE_VERTEX_COUNT = 4
const FACE_VERTEX_INDEX_COUNT = 6

export class ChunkMesher {
  static vertexData: Vertex[] = [
    // left
    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
    { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    // right
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
    { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
    // bottom
    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] },
    // top
    { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
    { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] },
    // back
    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
    { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
    // front
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] }
  ] as const

  static vertexIndices = [0, 1, 2, 2, 1, 3] as const

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly blockGetter: (x: number, y: number, z: number) => number
  ) {}

  generateMesh() {
    const geometry = this.generateGeometry()
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

  generateGeometry() {
    const { positions, normals, uvs, indices } = this.generateVertexData()

    // TODO: pack the data into a single Uint32 buffer

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

    return geometry
  }

  private static isSolid(block: number) {
    if (block === 0) return false
    return !blocks[block].transparent
  }

  private isSolid(x: number, y: number, z: number) {
    return ChunkMesher.isSolid(this.blockGetter(x, y, z))
  }

  private generateVertexData() {
    const vertices: Vertex[] = []
    const indices: number[] = []

    let lastIndex = 0

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let z = 0; z < this.depth; z++) {
          const block = this.blockGetter(x, y, z)
          if (!ChunkMesher.isSolid(block)) continue

          // use a face mask to determine which faces to render
          let faceMask = 0b000000
          if (!this.isSolid(x - 1, y, z)) faceMask |= 0b000001 // 1
          if (!this.isSolid(x + 1, y, z)) faceMask |= 0b000010 // 2
          if (!this.isSolid(x, y - 1, z)) faceMask |= 0b000100 // 4
          if (!this.isSolid(x, y + 1, z)) faceMask |= 0b001000 // 8
          if (!this.isSolid(x, y, z - 1)) faceMask |= 0b010000 // 16
          if (!this.isSolid(x, y, z + 1)) faceMask |= 0b100000 // 32
          if (faceMask === 0b000000) continue

          for (let i = 0; i < FACE_COUNT; i++) {
            // check if the current face is visible
            if ((faceMask & (1 << i)) === 0) continue
            indices.push(...ChunkMesher.vertexIndices.map((v) => lastIndex + v))
            const firstFaceVertexIndex = i * FACE_VERTEX_COUNT

            const faceVertices = ChunkMesher.vertexData
              .slice(
                firstFaceVertexIndex,
                firstFaceVertexIndex + FACE_VERTEX_COUNT
              )
              .map((vertex) => {
                const pos: [number, number, number] = [
                  vertex.pos[0] / 2 + x,
                  vertex.pos[1] / 2 + y,
                  vertex.pos[2] / 2 + z
                ]
                // TODO: calculate light level
                // TODO: calculate AO
                // TODO: calculate UVs
                return { ...vertex, pos }
              })
            vertices.push(...faceVertices)
            lastIndex += FACE_VERTEX_COUNT
          }
        }
      }
    }

    const positions = vertices.map((v) => v.pos).flat()
    const normals = vertices.map((v) => v.norm).flat()
    const uvs = vertices.map((v) => v.uv).flat()

    return { positions, normals, uvs, indices }
  }
}
