import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import { ChunkManager } from './ChunkManager'
import { TerrainGenerator } from './TerrainGenerator'

const buildChunkManager = () => {
  const terrainGenerator = new TerrainGenerator(69420)
  const renderDistance = new THREE.Vector3(1, 1, 1)
  return new ChunkManager(terrainGenerator, renderDistance)
}

describe('#createChunksAroundOrigin()', () => {
  it('should create the correct amount of chunks', () => {
    const chunkManager = buildChunkManager()
    const chunks = chunkManager.createChunksAroundOrigin(0, 0, 0)
    expect(chunks).toHaveLength(27)
  })
})

describe('#getChunksToUnload()', () => {
  it('should return no chunks if all are within render distance', () => {
    const chunkManager = buildChunkManager()
    chunkManager.createChunksAroundOrigin(0, 0, 0)
    const chunksToUnload = chunkManager.getChunksToUnload(0, 0, 0)
    expect(chunksToUnload).toHaveLength(0)
  })

  it('should return the correct chunks to unload', () => {
    const chunkManager = buildChunkManager()
    chunkManager.createChunksAroundOrigin(0, 0, 0)
    const chunksToUnload = chunkManager.getChunksToUnload(1, 0, 0)
    expect(chunksToUnload).toHaveLength(9)
  })
})
