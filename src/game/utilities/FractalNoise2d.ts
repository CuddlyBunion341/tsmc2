// https://www.npmjs.com/package/glsl-noise
// https://www.npmjs.com/package/simplex-noise
// https://www.youtube.com/watch?app=desktop&v=G1T8H58EP70

import type { NoiseFunction2D} from 'simplex-noise';
import { createNoise2D } from 'simplex-noise'
import type { FractalNoiseParams } from './FractalNoiseBase';
import { FractalNoiseBase, createSeededRandomizer } from './FractalNoiseBase';
import type { Vector2 } from 'three';

export class FractalNoise2d extends FractalNoiseBase<Vector2> {
  declare private noiseFunction: NoiseFunction2D

  public constructor(params: FractalNoiseParams) {
    super(params)
  }

  public deserialize(data: FractalNoiseParams) {
    super.deserialize(data)
    this.noiseFunction = createNoise2D(createSeededRandomizer(data.seed))
  }

  protected noiseFunctionValue(position: Vector2) {
    return this.noiseFunction(position.x, position.y)
  }
}
