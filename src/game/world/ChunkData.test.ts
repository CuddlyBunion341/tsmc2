import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import { ChunkData } from './ChunkData'

describe('#constructor()', () => {
  const chunkData = new ChunkData(new THREE.Vector3(1, 2, 3))

  it('should create a matrix with the correct dimensions', () => {
    expect(chunkData.dimensions.x).toEqual(3)
    expect(chunkData.dimensions.y).toEqual(4)
    expect(chunkData.dimensions.z).toEqual(5)
  })
})

describe('#getIndex()', () => {
  const chunkData = new ChunkData(new THREE.Vector3(32, 32, 32))

  it('should return the correct index', () => {
    expect(chunkData.getIndex(new THREE.Vector3(-1, -1, -1))).toEqual(0)
    expect(chunkData.getIndex(new THREE.Vector3(0, -1, -1))).toEqual(1)
  })
})
