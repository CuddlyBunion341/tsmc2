// https://www.npmjs.com/package/glsl-noise
// https://www.npmjs.com/package/simplex-noise
// https://www.youtube.com/watch?app=desktop&v=G1T8H58EP70

import type { NoiseFunction2D} from 'simplex-noise';
import { createNoise2D } from 'simplex-noise'
import type { FractalNoiseParams } from './FractalNoiseBase';
import { FractalNoiseBase, createSeededRandomizer } from './FractalNoiseBase';
export class FractalNoise2d extends FractalNoiseBase {
  private noiseFunction!: NoiseFunction2D

  public constructor(params: FractalNoiseParams) {
    super(params)
  }

  public get(x: number, y: number) {

    let noise = 0
    let amplitudeSum = 0

    for (let o = 0; o < this.octaves; o++) {
      const l = Math.pow(this.lacunarity, o)
      const p = Math.pow(this.persistence, o)

      amplitudeSum += 1 / p

      noise +=
        (1 / p) *
        this.noiseFunction(x / (this.frequency / l), y / (this.frequency / l))
    }

    noise = noise / amplitudeSum

    return noise
  }

  public deserialize(data: FractalNoiseParams) {
    super.deserialize(data)
    this.noiseFunction = createNoise2D(createSeededRandomizer(data.seed))
  }
}
