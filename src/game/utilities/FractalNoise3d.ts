import type { NoiseFunction3D} from "simplex-noise";
import { createNoise3D } from "simplex-noise"
import type { FractalNoiseParams} from "./FractalNoiseBase";
import { FractalNoiseBase, createSeededRandomizer } from "./FractalNoiseBase"

export class FractalNoise3d extends FractalNoiseBase {
  declare private noiseFunction: NoiseFunction3D

  public constructor(params: FractalNoiseParams) {
    super(params)
  }

  public get(x: number, y: number, z: number) {
    let noise = 0
    let amplitudeSum = 0

    for (let o = 0; o < this.octaves; o++) {
      const l = Math.pow(this.lacunarity, o)
      const p = Math.pow(this.persistence, o)

      amplitudeSum += 1 / p

      noise +=
        (1 / p) *
        this.noiseFunction(x / (this.frequency / l), y / (this.frequency / l), z / (this.frequency / l))
    }

    noise = noise / amplitudeSum

    return noise
  }

  public deserialize(data: FractalNoiseParams) {
    super.deserialize(data)

    this.noiseFunction = createNoise3D(createSeededRandomizer(data.seed))
  }
}
