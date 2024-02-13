import * as THREE from 'three'
import { blockIds, blocks } from './blocks'
import { ChunkData } from './ChunkData'

export type Tripplet<T> = [T, T, T]
export type Touple<T> = [T, T]

export type Vertex = {
  blockId: number
  ao: number
  position: Tripplet<number>
  normal: Tripplet<number>
  uv: Touple<number>
  color: Tripplet<number>
}

const FACE_COUNT = 6
const FACE_VERTEX_COUNT = 4

export type VertexPackPropertyName = 'positionX' | 'positionY' | 'positionZ' | 'blockId' | 'ao'
type PACKING_CONSTANT_PROPERTY = {
  bits: number
  offset: number
  mask: number
}

export const PACKING_CONSTANTS = (() => {
  const POSITION_BITS = 5
  const BLOCK_ID_BITS = 8
  const AO_BITS = 3

  const properties: {name: VertexPackPropertyName, bits: number}[] = [
    { name: 'positionX', bits: POSITION_BITS },
    { name: 'positionY', bits: POSITION_BITS },
    { name: 'positionZ', bits: POSITION_BITS },
    { name: 'blockId', bits: BLOCK_ID_BITS },
    { name: 'ao', bits: AO_BITS },
  ]

  const propertiesWithOffset = properties.map(p => ( {...p, offset: 0} ))

  propertiesWithOffset.reduce((offset, property) => {
    property.offset = offset
    return offset + property.bits
  }, 0)

  const getMask = (bits: number) => (1 << bits) - 1

  const propertiesWithMask = propertiesWithOffset.map(property => {
    return {
      name: property.name,
      bits: property.bits,
      offset: property.offset,
      mask: getMask(property.bits)
    }
  })

  const propertiesHash: Record<VertexPackPropertyName, PACKING_CONSTANT_PROPERTY> = {} as Record<VertexPackPropertyName, PACKING_CONSTANT_PROPERTY>

  propertiesWithMask.forEach(property => {
    propertiesHash[property.name] = property
  })

  return propertiesHash
})()

export class ChunkMesher {
  static vertexData: Vertex[] = [
    // left
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [-1, 0, 0], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [-1, 0, 0], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [-1, 0, 0], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [-1, 0, 0], uv: [1, 1] },
    // right
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [1, 0, 0], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [1, 0, 0], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [1, 0, 0], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [1, 0, 0], uv: [1, 1] },
    // bottom
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [0, -1, 0], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [0, -1, 0], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [0, -1, 0], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [0, -1, 0], uv: [1, 1] },
    // top
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [0, 1, 0], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 1, 0], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [0, 1, 0], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 1, 0], uv: [1, 1] },
    // back
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, -1], normal: [0, 0, -1], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, -1], normal: [0, 0, -1], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, -1], normal: [0, 0, -1], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 0, -1], uv: [1, 1] },
    // front
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, -1, 1], normal: [0, 0, 1], uv: [0, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, -1, 1], normal: [0, 0, 1], uv: [1, 0] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 0, 1], uv: [0, 1] },
    { ao: 0, blockId: 0, color: [0, 0, 0], position: [1, 1, 1], normal: [0, 0, 1], uv: [1, 1] }
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

  static encodeVertex(vertex: Vertex) {
    // encodes vertex data into a single 32 bit integer
    // 0b000000_AAA_BBBBBBBB_ZZZZZ_YYYYY_XXXXX

    let vertexData =  0

    vertexData |= vertex.position[0] & 0b11111
    vertexData |= (vertex.position[1] & 0b11111) << 5
    vertexData |= (vertex.position[2] & 0b11111) << 10

    vertexData |= vertex.blockId << 15
    vertexData |= ((vertex.ao * 8) & 0b111) << 23

    return vertexData
  }

  packVertexData() {
    const {vertices, indices} = this.generateChunkVertices()
    const vertexData = vertices.map(ChunkMesher.encodeVertex) 

    console.log(PACKING_CONSTANTS)

    return { vertices: vertexData, indices }
  }

  generateGeometry() {
    const { vertices, indices } = this.packVertexData()

    const geometry = new THREE.BufferGeometry()

    const attribute = new THREE.Uint32BufferAttribute(new Uint32Array(vertices), 1)
    attribute.gpuType = THREE.IntType
    geometry.setAttribute('data', attribute)

    geometry.setIndex(indices)

    return geometry
  }
  

  private static isSolid(block: number) {
    if (block === 0) return false
    return !blocks[block]?.transparent
  }

  private isSolid(blockPosition: THREE.Vector3) {
    return ChunkMesher.isSolid(this.chunkData.get(blockPosition))
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

  generateFaceVertices(faceIndex: number, blockId: number, blockPosition: THREE.Vector3) {
    const firstFaceVertexIndex = faceIndex * FACE_VERTEX_COUNT

    // const color = blocks[blockId].color

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
        // return { ...vertex, position, blockId, color: color.map(v => v * ao) as [number, number, number] }
        return {...vertex, position, blockId, ao }
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
