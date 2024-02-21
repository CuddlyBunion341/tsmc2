import * as THREE from 'three'
import { blockIds, blocks } from '../data/blocks'
import { ChunkData } from '../data/ChunkData'
import { AbstractChunkMesher, Vertex } from './AbstractChunkMesher'

export class CullingChunkMesher extends AbstractChunkMesher {
  constructor( dimensions: THREE.Vector3, chunkData: ChunkData) {
    super(dimensions, chunkData)
   }

  generateGeometry() {
    const { vertices, indices } = this.generateChunkVertices()

    const geometry = new THREE.BufferGeometry()

    CullingChunkMesher.geometryAttributes.forEach(({ name, size }) => {
      const attributeData = vertices.map((v) => v[name]).flat()
      const attribute = new THREE.BufferAttribute(new Float32Array(attributeData), size)
      geometry.setAttribute(name, attribute)
    })

    geometry.setIndex(indices)

    return geometry
  }

  private static isSolid(block: number) {
    if (block === 0) return false
    return !blocks[block]?.transparent
  }

  private isSolid(blockPosition: THREE.Vector3) {
    return CullingChunkMesher.isSolid(this.chunkData.get(blockPosition))
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
          const block = this.chunkData.get(blockPosition)
          if (!CullingChunkMesher.isSolid(block)) continue

          // use a face mask to determine which faces to render
          let faceMask = 0b000000
          if (!this.isSolid(neighborPosition.set(x - 1, y, z))) faceMask |= 0b000001 // 1
          if (!this.isSolid(neighborPosition.set(x + 1, y, z))) faceMask |= 0b000010 // 2
          if (!this.isSolid(neighborPosition.set(x, y - 1, z))) faceMask |= 0b000100 // 4
          if (!this.isSolid(neighborPosition.set(x, y + 1, z))) faceMask |= 0b001000 // 8
          if (!this.isSolid(neighborPosition.set(x, y, z - 1))) faceMask |= 0b010000 // 16
          if (!this.isSolid(neighborPosition.set(x, y, z + 1))) faceMask |= 0b100000 // 32
          if (faceMask === 0b000000) continue

          for (let i = 0; i < CullingChunkMesher.cubeFaceCount; i++) {
            // check if the current face is visible
            if ((faceMask & (1 << i)) === 0) continue
            const faceVertices = this.generateFaceVertices(i, block, blockPosition)
            vertices.push(...faceVertices)

            indices.push(...CullingChunkMesher.vertexIndices.map((v) => lastIndex + v))
            lastIndex += CullingChunkMesher.faceVertexCount
          }
        }
      }
    }

    return { vertices, indices }
  }

  generateFaceVertices(faceIndex: number, blockId: number, blockPosition: THREE.Vector3) {
    const firstFaceVertexIndex = faceIndex * CullingChunkMesher.faceVertexCount

    const color = blocks[blockId].color

    const vertexPosition = new THREE.Vector3(0, 0, 0)

    const faceVertices = CullingChunkMesher.vertexData
      .slice(firstFaceVertexIndex, firstFaceVertexIndex + CullingChunkMesher.faceVertexCount)
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

  affectsAo(blockId: number) {
    return blockId !== blockIds.air
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
