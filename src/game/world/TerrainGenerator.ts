import { FractalNoise2d } from '../utilities/Noise'
import { blockIds } from './blocks'

export class TerrainGenerator {
  public readonly noise2d

  constructor(public readonly seed: number) {
    this.noise2d = new FractalNoise2d(this.seed, 4)
    this.noise2d.frequencyX = 50
    this.noise2d.frequencyY = 50
  }

  public getBlock(x: number, y: number, z: number) {
    const height = this.noise2d.get(x, z) * 10

    if (y > height) return blockIds.air

    return blockIds.stone
  }
}
