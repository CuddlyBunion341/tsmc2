import * as THREE from 'three'
import { FractalNoise2d } from '../utilities/Noise'
import { blockIds } from './blocks'

export type TerrainGeneratorParams = {
  seed: number
  hilliness: number
  frequencyX: number
  frequencyY: number
  persistence: number
}

export class TerrainGenerator {

  public readonly noise2d: FractalNoise2d
  public hilliness: number

  constructor(public seed: number) {
    this.noise2d = new FractalNoise2d(this.seed, 4)
    this.noise2d.frequencyX = 100
    this.noise2d.frequencyY = 100
    this.noise2d.persistence = 2
    this.hilliness = 20
  }

  public static fromMessageData(data: TerrainGeneratorParams) {
    const generator = new TerrainGenerator(data.seed)
    generator.deserialize(data)
    return generator
  }

  public getBlock(blockPosition: THREE.Vector3) {
    const { x, y, z } = blockPosition

    const height = this.noise2d.get(x, z) * this.hilliness

    if (y > height) return blockIds.air
    if (y > 5) return blockIds.grass
    if (y > 0) return blockIds.dirt

    return blockIds.stone
  }

  serialize(): TerrainGeneratorParams {
    return { hilliness: this.hilliness, seed: this.seed, frequencyX: this.noise2d.frequencyX, frequencyY: this.noise2d.frequencyY, persistence: this.noise2d.persistence }
  }

  deserialize(data: TerrainGeneratorParams) {
    this.seed = data.seed
    this.hilliness = data.hilliness
    this.noise2d.frequencyX = data.frequencyX
    this.noise2d.frequencyY = data.frequencyY
    this.noise2d.persistence = data.persistence
    this.noise2d.frequencyX = data.frequencyX
    this.noise2d.frequencyY = data.frequencyY
  }
}
