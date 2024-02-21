import * as THREE from 'three'
import { Chunk } from './Chunk'
import { ChunkStorage } from './ChunkStorage'
import { describe, expect, test } from 'vitest'
import { TerrainGenerator } from '../TerrainGenerator'

describe('#getChunkKey()', () => {
  test('should generate the correct key', () => {
    const chunkStorage = new ChunkStorage(new THREE.Vector3(32, 32, 32))
    expect(chunkStorage.getChunkKey(new THREE.Vector3(1, 2, 3))).toBe('1,2,3')
  })
})

describe('#getBlockChunk(), #addChunk()', () => {
  test('should return the correct chunk', () => {
    const chunkStorage = new ChunkStorage(new THREE.Vector3(32, 32, 32))
    const terrainGenerator = new TerrainGenerator(0)
    const chunk = new Chunk(
      terrainGenerator,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(32, 32, 32)
    )
    chunkStorage.addChunk(chunk)

    expect(chunkStorage.getBlockChunk(new THREE.Vector3(0, 0, 0))).toBe(chunk)
    expect(chunkStorage.getBlockChunk(new THREE.Vector3(31, 31, 31))).toBe(chunk)
    expect(chunkStorage.getBlockChunk(new THREE.Vector3(32, 32, 32))).toBe(undefined)
  })
})
