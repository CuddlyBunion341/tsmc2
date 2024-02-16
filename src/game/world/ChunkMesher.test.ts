import * as THREE from 'three'
import { describe, it, expect, beforeEach } from 'vitest'
import { ChunkMesher, Vertex } from './ChunkMesher'
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

const vertexStub: Vertex = {
  materialIndex: 0,
  color: [0, 0, 0],
  position: [0, 0, 0],
  normal: [0, 0, 0],
  uv: [0, 0]
} as const

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

describe('.calculateVertexGroups()', () => {
  it('should return the correct geometry groups', () => {
    const vertices: Vertex[] = []

    const addVertex = (materialIndex: number) => {
      vertices.push({ ...vertexStub, materialIndex })
    }

    for (let i = 0; i < 4; i++) addVertex(0)
    for (let i = 0; i < 8; i++) addVertex(1)
    for (let i = 0; i < 16; i++) addVertex(0)

    const expected = [
      { start: 0, count: 4, materialIndex: 0 },
      { start: 4, count: 8, materialIndex: 1 },
      { start: 12, count: 16, materialIndex: 0 },
    ]

    expect(ChunkMesher.calculateVertexGroups(vertices)).toEqual(expected)
  })
})
