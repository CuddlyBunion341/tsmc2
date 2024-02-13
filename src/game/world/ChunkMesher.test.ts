import * as THREE from 'three'
import { describe, it, expect, beforeEach } from 'vitest'
import { ChunkMesher, Tripplet, Vertex } from './ChunkMesher'
import { ChunkData } from './ChunkData'
import { blockIds } from './blocks'

const assertGeometryArray = (array: number[], length: number) => {
  expect(array).toHaveLength(length)
  expect(array).not.toContain(undefined)
  expect(array).not.toContain(null)
  expect(array).not.toContain(NaN)
}

const assertVertexData = (vertex: Vertex) => {
  assertGeometryArray(vertex.position, 3)
  assertGeometryArray(vertex.normal, 3)
  assertGeometryArray(vertex.uv, 2)
}

const buildVertex = (): Vertex => {
  return {
    position: [0, 0, 0],
    normal: [0, 0, 0],
    uv: [0, 0],
    color: [0, 0, 0],
    blockId: 0,
    ao: 0
  }
}


describe('.encodeVertex()', () => {

  it('encodes empty vertex correctly', () => {
    const vertex = buildVertex()
    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b000_00000000_00000_00000_000000)
  })

  it('encodes position data correctly', () => {
    const vertex = {...buildVertex(), position: [1,2,3] as Tripplet<number>}
    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b000_00000000_00011_00010_00001)
  })


  it('encodes position data correctly at chunk borders', () => {
    const vertex = {...buildVertex(), position: [31,31,31] as Tripplet<number>}
    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b000_00000000_11111_11111_11111)
  })

  it('encodes block data correctly', () => {
    const vertex = {...buildVertex(), blockId: 179}
    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b000_10110011_00000_00000_00000)
  })

  it('encodes ambient occlusion data correctly', () => {
    const vertex = {...buildVertex(), ao: 0.625}
    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b101_00000000_00000_00000_00000)
  })

  it('encodes all data correctly', () => {
    const vertex = {
      ...buildVertex(),
      position: [1,2,3] as Tripplet<number>,
      blockId: 4,
      ao: 0.625
    }

    const encoded = ChunkMesher.encodeVertex(vertex)
    expect(encoded).toEqual(0b101_00000100_00011_00010_00001)
  })
})

describe('#generateFaceGeometry()', () => {
  it('should generate the correct face', () => {
    const chunkMesher = new ChunkMesher(
      new THREE.Vector3(1, 1, 1),
      new ChunkData(new THREE.Vector3(1, 1, 1))
    )
    const faceVertices = chunkMesher.generateFaceVertices(0, blockIds.stone, new THREE.Vector3(0, 0, 0))
    expect(faceVertices).toHaveLength(4)
  })
})

describe('#generateVertexData()', () => {
  let chunkData: ChunkData
  let chunkMesher: ChunkMesher

  beforeEach(() => {
    const dimensions = new THREE.Vector3(32, 32, 32)
    chunkData = new ChunkData(dimensions)
    chunkMesher = new ChunkMesher(dimensions, chunkData)
  })

  it('should generate correct vertices for a cube', () => {
    chunkData.set(new THREE.Vector3(0, 0, 0), blockIds.stone)
    const { vertices } = chunkMesher.generateChunkVertices()
    expect(vertices).toHaveLength(4 * 6)
    vertices.forEach(assertVertexData)
  })

  it('should generate correct vertices when face culling', () => {
    chunkData.set(new THREE.Vector3(0, 0, 0), blockIds.stone)
    chunkData.set(new THREE.Vector3(1, 0, 0), blockIds.stone)
    const { vertices } = chunkMesher.generateChunkVertices()
    expect(vertices).toHaveLength(4 * 6 + 4 * 4)
    vertices.forEach(assertVertexData)
  })

  it('should generate the correct amount of indices', () => {
    chunkData.set(new THREE.Vector3(0, 0, 0), blockIds.stone)
    const { indices } = chunkMesher.generateChunkVertices()
    expect(indices).toHaveLength(6 * 6)
  })

  it('should return empty vertex array if there are no voxels', () => {
    const { indices, vertices } = chunkMesher.generateChunkVertices()
    expect(indices).toHaveLength(0)
    expect(vertices).toHaveLength(0)
  })
})
