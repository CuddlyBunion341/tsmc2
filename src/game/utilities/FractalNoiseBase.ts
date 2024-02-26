import type GUI from "lil-gui"
import { MersenneTwister19937, Random } from 'random-js'
import type { Vector2, Vector3 } from "three"

export type FractalNoiseParams = {
	seed: number
	amplitude: number
	frequency: number
	lacunarity: number
	persistence: number
	octaves: number
}


export class FractalNoiseBase<T extends Vector2 | Vector3>{
	declare public seed: number
	declare public amplitude: number
	declare public frequency: number
	declare public lacunarity: number
	declare public persistence: number
	declare public octaves: number

	public constructor(params: FractalNoiseParams) {
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

	public get(position: T): number {
		let noise = 0
		let amplitudeSum = 0

		for (let o = 0; o < this.octaves; o++) {
			const octaveNoise = this.getNoiseOctave(position, o)
			const amplitude = 1 / Math.pow(this.persistence, o)

			amplitudeSum += amplitude
			noise += amplitude * octaveNoise
		}

		noise = noise / amplitudeSum

		return noise
	}

	public serialize(): FractalNoiseParams {
		return {
			amplitude: this.amplitude,
			frequency: this.frequency,
			lacunarity: this.lacunarity,
			persistence: this.persistence,
			seed: this.seed,
			octaves: this.octaves
		}
	}

	public deserialize(data: FractalNoiseParams) {
		this.amplitude = data.amplitude
		this.frequency = data.frequency
		this.lacunarity = data.lacunarity
		this.persistence = data.persistence
		this.seed = data.seed
		this.octaves = data.octaves
	}

	protected getNoiseOctave(position: T, octave: number): number {
		const l = Math.pow(this.lacunarity, octave);
    const p = Math.pow(this.persistence, octave);

    position.divideScalar(this.frequency / l);

    const noiseValue = (1 / p) * this.noiseFunctionValue(position);

    position.multiplyScalar(this.frequency / l);

    return noiseValue;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this, @typescript-eslint/no-unused-vars
	protected noiseFunctionValue(position: T): number {
		throw new Error('Not implemented')
	}
}

export function createSeededRandomizer(seed: number) {
  const engine = MersenneTwister19937.seed(seed)
  const random = new Random(engine)
  return () => random.realZeroToOneExclusive()
}
