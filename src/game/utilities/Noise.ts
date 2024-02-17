// https://www.npmjs.com/package/glsl-noise
// https://www.npmjs.com/package/simplex-noise
// https://www.youtube.com/watch?app=desktop&v=G1T8H58EP70

import { NoiseFunction2D, createNoise2D } from 'simplex-noise'
import { MersenneTwister19937, Random } from 'random-js'

export function seededRandomizer(seed: number) {
  const engine = MersenneTwister19937.seed(seed)
  const random = new Random(engine)
  return () => random.realZeroToOneExclusive()
}

export class FractalNoise2d {
  public amplitude = 1
  public frequencyX = 30
  public frequencyY = 30
  public lacunarity = 2
  public persistence = 2
  public noiseFunction: NoiseFunction2D

  constructor(public readonly seed: number, public octaves: number) {
    this.noiseFunction = createNoise2D(seededRandomizer(seed))
  }

  public getOctave(x: number, y: number, octave: number): number {
    return (
      this.noiseFunction(
        (x * this.frequencyX * this.lacunarity) / octave,
        ((y / (this.frequencyY * octave)) * this.lacunarity) / octave
      ) *
      this.amplitude *
      this.lacunarity
    )
  }

  public get(x: number, y: number): number {
    let noise = 0

    let amplitudeSum = 0

    for (let o = 0; o < this.octaves; o++) {
      const l = Math.pow(this.lacunarity, o)
      const p = Math.pow(this.persistence, o)

      amplitudeSum += 1 / p

      noise +=
        (1 / p) *
        this.noiseFunction(x / (this.frequencyX / l), y / (this.frequencyY / l))
    }

    noise = noise / amplitudeSum

    return noise
  }
}
