import * as THREE from 'three'
import { FractalNoise2d } from '../utilities/Noise'
import { blockIds } from './blocks'

export class TerrainGenerator {
  public readonly noise2d

  constructor(public readonly seed: number) {
    this.noise2d = new FractalNoise2d(this.seed, 4)
    this.noise2d.frequencyX = 100
    this.noise2d.frequencyY = 100
    this.noise2d.persistence = 2
  }

  public getBlock(blockPosition: THREE.Vector3) {
    const { x, y, z } = blockPosition

    const height = this.noise2d.get(x, z) * 20

    if (y > height) return blockIds.air
    if (y > 5) return blockIds.grass
    if (y > 0) return blockIds.dirt

    return blockIds.stone
  }
}
