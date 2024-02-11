import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import { BlockLattice } from './BlockLattice'

describe('#getIndex()', () => {
  const chunkData = new BlockLattice(new THREE.Vector3(32, 32, 32))

  it('should return the correct index for the x axis', () => {
    expect(chunkData.getIndex(new THREE.Vector3(0, 0, 0))).toBe(0)
    expect(chunkData.getIndex(new THREE.Vector3(1, 0, 0))).toBe(1)
    expect(chunkData.getIndex(new THREE.Vector3(2, 0, 0))).toBe(2)
  })

  it('should return the correct index for the y axis', () => {
    expect(chunkData.getIndex(new THREE.Vector3(0, 1, 0))).toBe(32)
    expect(chunkData.getIndex(new THREE.Vector3(0, 2, 0))).toBe(32 * 2)
    expect(chunkData.getIndex(new THREE.Vector3(1, 2, 0))).toBe(32 * 2 + 1)
  })

  it('should return the correct index for the z axis', () => {
    expect(chunkData.getIndex(new THREE.Vector3(0, 0, 1))).toBe(32 * 32)
    expect(chunkData.getIndex(new THREE.Vector3(0, 0, 2))).toBe(32 * 32 * 2)
    expect(chunkData.getIndex(new THREE.Vector3(1, 2, 3))).toBe(32 * 32 * 3 + 32 * 2 + 1)
  })
})

describe('#get(), #set()', () => {
  const chunkData = new BlockLattice(new THREE.Vector3(32, 32, 32), 5)
  it('should fill the matrix with the default value', () => {
    expect(chunkData.get(new THREE.Vector3(0, 0, 0))).toBe(5)
  })
  it('should return the correct value', () => {
    chunkData.set(new THREE.Vector3(0, 0, 0), 1)
    expect(chunkData.get(new THREE.Vector3(0, 0, 0))).toBe(1)
  })
})
