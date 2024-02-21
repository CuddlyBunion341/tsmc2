import * as THREE from 'three'
import { blockIds, blocks } from './blocks'
import type { ChunkData } from './ChunkData'

export type Vertex = {
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
  color: [number, number, number]
}

const FACE_COUNT = 6
const FACE_VERTEX_COUNT = 4

export class ChunkMesher {
  public static geometryAttributes = [
    { name: 'position', size: 3 },
    { name: 'normal', size: 3 },
    { name: 'uv', size: 2 },
    { name: 'color', size: 3 }
  ] as const

  public static vertexData: Vertex[] = [
    // left
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [-1, 0, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [-1, 0, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [-1, 0, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [-1, 0, 0], uv: [1, 1] },
    // right
    { color: [0, 0, 0], position: [1, -1, 1], normal: [1, 0, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [1, -1, -1], normal: [1, 0, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [1, 0, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [1, 1, -1], normal: [1, 0, 0], uv: [1, 1] },
    // bottom
    { color: [0, 0, 0], position: [1, -1, 1], normal: [0, -1, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [0, -1, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, -1, -1], normal: [0, -1, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [0, -1, 0], uv: [1, 1] },
    // top
    { color: [0, 0, 0], position: [1, 1, -1], normal: [0, 1, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 1, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [0, 1, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 1, 0], uv: [1, 1] },
    // back
    { color: [0, 0, 0], position: [1, -1, -1], normal: [0, 0, -1], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [0, 0, -1], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, -1], normal: [0, 0, -1], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 0, -1], uv: [1, 1] },
    // front
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [0, 0, 1], uv: [0, 0] },
    { color: [0, 0, 0], position: [1, -1, 1], normal: [0, 0, 1], uv: [1, 0] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 0, 1], uv: [0, 1] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [0, 0, 1], uv: [1, 1] }
  ] as const

  public static vertexIndices = [0, 1, 2, 2, 1, 3] as const

  public constructor(
    public readonly dimensions: THREE.Vector3,
    public readonly chunkData: ChunkData
  ) { }

  public generateGeometry() {
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


  public generateChunkVertices() {
    const vertices: Vertex[] = []
    const indices: number[] = []

    let lastIndex = 0

    const blockPosition = new THREE.Vector3(0, 0, 0)
    const neighborPosition = new THREE.Vector3(0, 0, 0)

    for (let x = 0; x < this.dimensions.x; x++) {
      for (let y = 0; y < this.dimensions.y; y++) {
        for (let z = 0; z < this.dimensions.z; z++) {
          blockPosition.set(x, y, z)
          const block = this.chunkData.get(blockPosition)
          if (!ChunkMesher.isSolid(block)) continue

          // use a face mask to determine which faces to render
          let faceMask = 0b000000
          if (!this.isSolid(neighborPosition.set(x - 1, y, z))) faceMask |= 0b000001 // 1
          if (!this.isSolid(neighborPosition.set(x + 1, y, z))) faceMask |= 0b000010 // 2
          if (!this.isSolid(neighborPosition.set(x, y - 1, z))) faceMask |= 0b000100 // 4
          if (!this.isSolid(neighborPosition.set(x, y + 1, z))) faceMask |= 0b001000 // 8
          if (!this.isSolid(neighborPosition.set(x, y, z - 1))) faceMask |= 0b010000 // 16
          if (!this.isSolid(neighborPosition.set(x, y, z + 1))) faceMask |= 0b100000 // 32
          if (faceMask === 0b000000) continue

          for (let i = 0; i < FACE_COUNT; i++) {
            // check if the current face is visible
            if ((faceMask & (1 << i)) === 0) continue
            const faceVertices = this.generateFaceVertices(i, block, blockPosition)
            vertices.push(...faceVertices)

            indices.push(...ChunkMesher.vertexIndices.map((v) => lastIndex + v))
            lastIndex += FACE_VERTEX_COUNT
          }
        }
      }
    }

    return { vertices, indices }
  }

  public generateFaceVertices(faceIndex: number, blockId: number, blockPosition: THREE.Vector3) {
    const firstFaceVertexIndex = faceIndex * FACE_VERTEX_COUNT

    const color = blocks[blockId].color

    const vertexPosition = new THREE.Vector3(0, 0, 0)

    const faceVertices = ChunkMesher.vertexData
      .slice(firstFaceVertexIndex, firstFaceVertexIndex + FACE_VERTEX_COUNT)
      .map((vertex) => {
        const position: [number, number, number] = [
          vertex.position[0] / 2 + blockPosition.x,
          vertex.position[1] / 2 + blockPosition.y,
          vertex.position[2] / 2 + blockPosition.z
        ]

        const ao = this.calculateVertexAO(vertexPosition.set(...position))

        // TODO: calculate light level
        // TODO: calculate UVs
        return { ...vertex, position, color: color.map(v => v * ao) as [number, number, number] }
      })

    return faceVertices
  }


  public positionAffectsAo(position: THREE.Vector3) {
    position.floor()
    return ChunkMesher.affectsAo(this.chunkData.get(position))
  }

  private calculateVertexAO(position: THREE.Vector3) {
    const { x, y, z } = position
    const neighborPosition = new THREE.Vector3(0, 0, 0)

    let occlusion = 0
    const maxOcclusion = 8

    const checkNeighbor = (dx: number, dy: number, dz: number) => {
      neighborPosition.set(x + dx, y + dy, z + dz)
      return this.positionAffectsAo(neighborPosition)
    }

    // Check each of the three voxels touching the corner
    if (checkNeighbor(0, 1, 0)) occlusion++
    if (checkNeighbor(1, 0, 0)) occlusion++
    if (checkNeighbor(0, 0, 1)) occlusion++

    // Check three voxels diagonal to the corner
    if (checkNeighbor(1, 1, 0) && (checkNeighbor(0, 1, 0) || checkNeighbor(1, 0, 0))) occlusion++
    if (checkNeighbor(0, 1, 1) && (checkNeighbor(0, 1, 0) || checkNeighbor(0, 0, 1))) occlusion++
    if (checkNeighbor(1, 0, 1) && (checkNeighbor(1, 0, 0) || checkNeighbor(0, 0, 1))) occlusion++
    if (checkNeighbor(1, 1, 1) && (checkNeighbor(0, 1, 1) || checkNeighbor(1, 0, 1) || checkNeighbor(1, 1, 0))) occlusion++

    // Normalize the occlusion value
    const aoValue = (maxOcclusion - occlusion) / maxOcclusion
    return aoValue
  }

  private static affectsAo(blockId: number) {
    return blockId !== blockIds.air
  }

  private static isSolid(block: number) {
    if (block === 0) return false
    return !blocks[block]?.transparent
  }

  private isSolid(blockPosition: THREE.Vector3) {
    return ChunkMesher.isSolid(this.chunkData.get(blockPosition))
  }
}
