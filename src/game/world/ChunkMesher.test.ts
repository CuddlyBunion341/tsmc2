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
  assertGeometryArray(vertex.pos, 3)
  assertGeometryArray(vertex.norm, 3)
  assertGeometryArray(vertex.uv, 2)
}

describe('#generateFaceGeometry()', () => {
  it('should generate the correct face', () => {
    const chunkMesher = new ChunkMesher(0, 0, 0, () => 0)
    const faceVertices = chunkMesher.generateFaceVertices(0, 0, 0, 0)
    expect(faceVertices).toHaveLength(4)
  })
})

describe('#generateVertexData()', () => {
  let chunkData: ChunkData
  let chunkMesher: ChunkMesher

  beforeEach(() => {
    chunkData = new ChunkData()
    chunkMesher = new ChunkMesher(
      chunkData.width,
      chunkData.height,
      chunkData.depth,
      (x, y, z) => chunkData.get(x, y, z)
    )
  })

  it('should generate correct vertices for a cube', () => {
    chunkData.set(0, 0, 0, blockIds.stone)
    const { vertices } = chunkMesher.generateChunkVertices()
    expect(vertices).toHaveLength(4 * 6)
    vertices.forEach(assertVertexData)
  })

  it('should generate correct vertices when face culling', () => {
    chunkData.set(0, 0, 0, blockIds.stone)
    chunkData.set(1, 0, 0, blockIds.stone)
    const { vertices } = chunkMesher.generateChunkVertices()
    expect(vertices).toHaveLength(4 * 6 + 4 * 4)
    vertices.forEach(assertVertexData)
  })

  it('should generate the correct amount of indices', () => {
    chunkData.set(0, 0, 0, blockIds.stone)
    const { indices } = chunkMesher.generateChunkVertices()
    expect(indices).toHaveLength(6 * 6)
  })

  it('should return empty vertex array if there are no voxels', () => {
    const { indices, vertices } = chunkMesher.generateChunkVertices()
    expect(indices).toHaveLength(0)
    expect(vertices).toHaveLength(0)
  })
})
