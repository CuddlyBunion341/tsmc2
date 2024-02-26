import type GUI from "lil-gui"
import { MersenneTwister19937, Random } from 'random-js'

export type FractalNoiseParams = {
	seed: number
	amplitude: number
	frequency: number
	lacunarity: number
	persistence: number
	octaves: number
}


export class FractalNoiseBase {
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
}

export function createSeededRandomizer(seed: number) {
  const engine = MersenneTwister19937.seed(seed)
  const random = new Random(engine)
  return () => random.realZeroToOneExclusive()
}
