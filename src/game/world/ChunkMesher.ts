import * as THREE from 'three'
import { blockIds, blocks } from './blocks'
import { ChunkData } from './ChunkData'

export type Vertex = {
  materialIndex: number,
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
  color: [number, number, number]
}

export type VertexGroup = {
  start: number
  count: number
  materialIndex: number
}

const FACE_COUNT = 6
const FACE_VERTEX_COUNT = 4

export class ChunkMesher {
  static geometryAttributes = [
    { name: 'position', size: 3 },
    { name: 'normal', size: 3 },
    { name: 'uv', size: 2 },
    { name: 'color', size: 3 }
  ] as const

  static vertexData: Vertex[] = [
    // left
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [-1, 0, 0], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [-1, 0, 0], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [-1, 0, 0], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [-1, 0, 0], uv: [1, 1] },
    // right
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [1, 0, 0], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [1, 0, 0], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [1, 0, 0], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [1, 0, 0], uv: [1, 1] },
    // bottom
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [0, -1, 0], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [0, -1, 0], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [0, -1, 0], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [0, -1, 0], uv: [1, 1] },
    // top
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [0, 1, 0], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 1, 0], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [0, 1, 0], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 1, 0], uv: [1, 1] },
    // back
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [0, 0, -1], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [0, 0, -1], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [0, 0, -1], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 0, -1], uv: [1, 1] },
    // front
    { materialIndex: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [0, 0, 1], uv: [0, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [0, 0, 1], uv: [1, 0] },
    { materialIndex: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 0, 1], uv: [0, 1] },
    { materialIndex: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [0, 0, 1], uv: [1, 1] }
  ] as const

  static vertexIndices = [0, 1, 2, 2, 1, 3] as const

  constructor(
    public readonly dimensions: THREE.Vector3,
    public readonly chunkData: ChunkData
  ) { }

  generateMesh() {
    const geometry = this.generateGeometry()
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

  static calculateVertexGroups(vertices: Vertex[]) {
    const groups: VertexGroup[] = []
    let currentGroup: VertexGroup | null = null

    vertices.forEach((vertex, index) => {
      if (!(!currentGroup || vertex.materialIndex !== currentGroup.materialIndex)) {
        currentGroup.count++
        return
      }

      currentGroup = {
        start: index,
        count: 1,
        materialIndex: vertex.materialIndex,
      };

      groups.push(currentGroup)
    })

    return groups
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
    geometry.addGroup(0, indices.length, 0)
    
    const vertexGroups = ChunkMesher.calculateVertexGroups(vertices)

    console.log(indices)
    console.log(vertices)
    console.log(vertexGroups)

    geometry.clearGroups()

    vertexGroups.forEach((group) => {
      geometry.addGroup(group.start / 4 * 6, group.count / 4 * 6, group.materialIndex)
    })

    return geometry
  }

  private static renderNeighbor(blockId: number, neighborBlockId: number) {
    if (!blocks[neighborBlockId].transparent) return false
    if (blockId === blockIds.air) return false
    if (neighborBlockId === blockIds.air) return true
    if (blocks[blockId].transparent && neighborBlockId !== blockId) return true
    if (!blocks[blockId].transparent && blocks[neighborBlockId].transparent) return true
    return false
  }

  private renderNeighbor(blockId: number, neighborBlockPosition: THREE.Vector3) {
    return ChunkMesher.renderNeighbor(blockId, this.chunkData.get(neighborBlockPosition))
  }

  generateChunkVertices() {
    const vertices: Vertex[] = []
    const indices: number[] = []

    let lastIndex = 0

    const blockPosition = new THREE.Vector3(0, 0, 0)
    const neighborPosition = new THREE.Vector3(0, 0, 0)

    for (let x = 0; x < this.dimensions.x; x++) {
      for (let y = 0; y < this.dimensions.y; y++) {
        for (let z = 0; z < this.dimensions.z; z++) {
          blockPosition.set(x, y, z)
          const blockId = this.chunkData.get(blockPosition)
          if (blockId === blockIds.air) continue

          // use a face mask to determine which faces to render
          let faceMask = 0b000000
          if (this.renderNeighbor(blockId, neighborPosition.set(x - 1, y, z))) faceMask |= 0b000001 // 1
          if (this.renderNeighbor(blockId, neighborPosition.set(x + 1, y, z))) faceMask |= 0b000010 // 2
          if (this.renderNeighbor(blockId, neighborPosition.set(x, y - 1, z))) faceMask |= 0b000100 // 4
          if (this.renderNeighbor(blockId, neighborPosition.set(x, y + 1, z))) faceMask |= 0b001000 // 8
          if (this.renderNeighbor(blockId, neighborPosition.set(x, y, z - 1))) faceMask |= 0b010000 // 16
          if (this.renderNeighbor(blockId, neighborPosition.set(x, y, z + 1))) faceMask |= 0b100000 // 32
          if (faceMask === 0b000000) continue

          for (let i = 0; i < FACE_COUNT; i++) {
            // check if the current face is visible
            if ((faceMask & (1 << i)) === 0) continue
            const faceVertices = this.generateFaceVertices(i, blockId, blockPosition)
            vertices.push(...faceVertices)

            indices.push(...ChunkMesher.vertexIndices.map((v) => lastIndex + v))
            lastIndex += FACE_VERTEX_COUNT
          }
        }
      }
    }

    return { vertices, indices }
  }

  blockMaterialIndex(blockId: number) {
    return blockId === blockIds.water ? 1 : 0
  }

  generateFaceVertices(faceIndex: number, blockId: number, blockPosition: THREE.Vector3) {
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
        return { ...vertex, materialIndex: this.blockMaterialIndex(blockId), position, color: color.map(v => v * ao) as [number, number, number] }
      })

    return faceVertices
  }

  affectsAo(blockId: number) {
    return !blocks[blockId].transparent
  }

  positionAffectsAo(position: THREE.Vector3) {
    position.floor()
    return this.affectsAo(this.chunkData.get(position))
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
}
