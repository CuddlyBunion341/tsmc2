// https://www.npmjs.com/package/glsl-noise
// https://www.npmjs.com/package/simplex-noise
// https://www.youtube.com/watch?app=desktop&v=G1T8H58EP70

import { NoiseFunction2D, createNoise2D } from 'simplex-noise'
import { MersenneTwister19937, Random } from 'random-js'
import GUI from 'lil-gui'

export interface FractalNoise2dParams {
  seed: number
  amplitude: number
  frequency: number
  lacunarity: number
  persistence: number
  octaves: number
}

export class FractalNoise2d {
  private noiseFunction!: NoiseFunction2D
  public seed!: number
  public amplitude!: number
  public frequency!: number
  public lacunarity!: number
  public persistence!: number
  public octaves!: number


  public constructor(params: FractalNoise2dParams) {
    this.deserialize(params)
  }

  public addToGUI(gui: GUI, changeCallback: () => void) {
    const folder = gui.addFolder('Fractal Noise 2D')
    folder.add(this, 'amplitude', 1, 100, 1).onChange(changeCallback)
    folder.add(this, 'frequency', 1, 1000, 1).onChange(changeCallback)
    folder.add(this, 'lacunarity', 1, 4, 0.1).onChange(changeCallback)
    folder.add(this, 'persistence', 1, 4, 0.1).onChange(changeCallback)
    folder.add(this, 'octaves', 1, 8, 1).onChange(changeCallback)
  }

  public getOctave(x: number, y: number, octave: number) {
    const { frequency, lacunarity, amplitude } = this
    return (
      this.noiseFunction(
        (x * frequency * lacunarity) / octave,
        ((y / (frequency * octave)) * lacunarity) / octave
      ) *
      amplitude *
      lacunarity
    )
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

  public serialize(): FractalNoise2dParams {
    return {
      amplitude: this.amplitude,
      frequency: this.frequency,
      lacunarity: this.lacunarity,
      persistence: this.persistence,
      seed: this.seed,
      octaves: this.octaves
    }
  }

  public deserialize(data: FractalNoise2dParams) {
    this.amplitude = data.amplitude
    this.frequency = data.frequency
    this.lacunarity = data.lacunarity
    this.persistence = data.persistence
    this.seed = data.seed
    this.noiseFunction = createNoise2D(createSeededRandomizer(data.seed))
    this.octaves = data.octaves
  }
}

function createSeededRandomizer(seed: number) {
  const engine = MersenneTwister19937.seed(seed)
  const random = new Random(engine)
  return () => random.realZeroToOneExclusive()
}
