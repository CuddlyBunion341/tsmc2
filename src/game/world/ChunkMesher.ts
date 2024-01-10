import * as THREE from 'three'
import { blocks } from './blocks'

export type Vertex = {
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
}

const FACE_COUNT = 6
const FACE_VERTEX_COUNT = 4

export class ChunkMesher {
  static geometryAttributes = [
    { name: 'position', size: 3 },
    { name: 'normal', size: 3 },
    { name: 'uv', size: 2 }
  ] as const

  static vertexData: Vertex[] = [
    // left
    { position: [-1, -1, -1], normal: [-1, 0, 0], uv: [0, 0] },
    { position: [-1, -1, 1], normal: [-1, 0, 0], uv: [1, 0] },
    { position: [-1, 1, -1], normal: [-1, 0, 0], uv: [0, 1] },
    { position: [-1, 1, 1], normal: [-1, 0, 0], uv: [1, 1] },
    // right
    { position: [1, -1, 1], normal: [1, 0, 0], uv: [0, 0] },
    { position: [1, -1, -1], normal: [1, 0, 0], uv: [1, 0] },
    { position: [1, 1, 1], normal: [1, 0, 0], uv: [0, 1] },
    { position: [1, 1, -1], normal: [1, 0, 0], uv: [1, 1] },
    // bottom
    { position: [1, -1, 1], normal: [0, -1, 0], uv: [0, 0] },
    { position: [-1, -1, 1], normal: [0, -1, 0], uv: [1, 0] },
    { position: [1, -1, -1], normal: [0, -1, 0], uv: [0, 1] },
    { position: [-1, -1, -1], normal: [0, -1, 0], uv: [1, 1] },
    // top
    { position: [1, 1, -1], normal: [0, 1, 0], uv: [0, 0] },
    { position: [-1, 1, -1], normal: [0, 1, 0], uv: [1, 0] },
    { position: [1, 1, 1], normal: [0, 1, 0], uv: [0, 1] },
    { position: [-1, 1, 1], normal: [0, 1, 0], uv: [1, 1] },
    // back
    { position: [1, -1, -1], normal: [0, 0, -1], uv: [0, 0] },
    { position: [-1, -1, -1], normal: [0, 0, -1], uv: [1, 0] },
    { position: [1, 1, -1], normal: [0, 0, -1], uv: [0, 1] },
    { position: [-1, 1, -1], normal: [0, 0, -1], uv: [1, 1] },
    // front
    { position: [-1, -1, 1], normal: [0, 0, 1], uv: [0, 0] },
    { position: [1, -1, 1], normal: [0, 0, 1], uv: [1, 0] },
    { position: [-1, 1, 1], normal: [0, 0, 1], uv: [0, 1] },
    { position: [1, 1, 1], normal: [0, 0, 1], uv: [1, 1] }
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
    const { vertices, indices } = this.generateChunkVertices()

    const geometry = new THREE.BufferGeometry()

    ChunkMesher.geometryAttributes.forEach(({ name, size }) => {
      const attributeData = vertices.map((v) => v[name]).flat()
      const attribute = new THREE.BufferAttribute(new Float32Array(attributeData), size)
      geometry.setAttribute(name, attribute)
    })

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

  generateChunkVertices() {
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
            const faceVertices = this.generateFaceVertices(i, x, y, z)
            vertices.push(...faceVertices)

            indices.push(...ChunkMesher.vertexIndices.map((v) => lastIndex + v))
            lastIndex += FACE_VERTEX_COUNT
          }
        }
      }
    }

    return { vertices, indices }
  }

  generateFaceVertices(faceIndex: number, x: number, y: number, z: number) {
    const firstFaceVertexIndex = faceIndex * FACE_VERTEX_COUNT

    const faceVertices = ChunkMesher.vertexData
      .slice(firstFaceVertexIndex, firstFaceVertexIndex + FACE_VERTEX_COUNT)
      .map((vertex) => {
        const position: [number, number, number] = [
          vertex.position[0] / 2 + x,
          vertex.position[1] / 2 + y,
          vertex.position[2] / 2 + z
        ]
        // TODO: calculate light level
        // TODO: calculate AO
        // TODO: calculate UVs
        return { ...vertex, position }
      })

    return faceVertices
  }
}
