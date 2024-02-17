// https://www.npmjs.com/package/glsl-noise
// https://www.npmjs.com/package/simplex-noise
// https://www.youtube.com/watch?app=desktop&v=G1T8H58EP70

import { NoiseFunction2D, createNoise2D } from 'simplex-noise'
import { MersenneTwister19937, Random } from 'random-js'
import GUI from 'lil-gui'

export function seededRandomizer(seed: number) {
  const engine = MersenneTwister19937.seed(seed)
  const random = new Random(engine)
  return () => random.realZeroToOneExclusive()
}

export type FractalNoise2dParams = {
  amplitude: number
  frequencyX: number
  frequencyY: number
  lacunarity: number
  persistence: number
  seed: number
  octaves: number
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

  addToGUI(gui: GUI, changeCallback: () => void) {
    const folder = gui.addFolder('Fractal Noise 2D')
    folder.add(this, 'amplitude', 1, 100, 1).onChange(changeCallback)
    folder.add(this, 'frequencyX', 1, 1000, 1).onChange(changeCallback)
    folder.add(this, 'frequencyY', 1, 1000, 1).onChange(changeCallback)
    folder.add(this, 'lacunarity', 1, 4, 0.1).onChange(changeCallback)
    folder.add(this, 'persistence', 1, 4, 0.1).onChange(changeCallback)
    folder.add(this, 'octaves', 1, 8, 1).onChange(changeCallback)
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

  public serialize(): FractalNoise2dParams {
    return {
      amplitude: this.amplitude,
      frequencyX: this.frequencyX,
      frequencyY: this.frequencyY,
      lacunarity: this.lacunarity,
      persistence: this.persistence,
      seed: this.seed,
      octaves: this.octaves
    }
  }

  public deserialize(data: FractalNoise2dParams) {
    this.amplitude = data.amplitude
    this.frequencyX = data.frequencyX
    this.frequencyY = data.frequencyY
    this.lacunarity = data.lacunarity
    this.persistence = data.persistence
    this.octaves = data.octaves
  }
}
