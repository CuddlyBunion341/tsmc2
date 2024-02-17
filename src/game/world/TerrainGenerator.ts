import * as THREE from 'three'
import { FractalNoise2d, FractalNoise2dParams } from '../utilities/Noise'
import { blockIds } from './blocks'
import GUI from 'lil-gui'

export type TerrainGeneratorParams = {
  seed: number
  hilliness: number
  fractalNoiseParams: FractalNoise2dParams
  grassLevel: number
  dirtLevel: number
}

export class TerrainGenerator {

  public noise2d: FractalNoise2d
  public hilliness: number
  public grassLevel: number
  public dirtLevel: number

  constructor(public seed: number) {
    this.noise2d = new FractalNoise2d(this.seed, 4)
    this.noise2d.frequencyX = 100
    this.noise2d.frequencyY = 100
    this.noise2d.persistence = 2
    this.hilliness = 20
    this.grassLevel = 5
    this.dirtLevel = 3
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
    if (y > this.grassLevel) return blockIds.grass
    if (y > this.dirtLevel) return blockIds.dirt

    return blockIds.stone
  }

  addToGUI(gui: GUI, changeCallback: () => void) {
    const folder = gui.addFolder('Terrain Generator')
    folder.add(this, 'hilliness', 1, 100, 1).onChange(changeCallback)
    folder.add(this, 'grassLevel', -50, 100, 1).onChange(changeCallback)
    folder.add(this, 'dirtLevel', -50, 100, 1).onChange(changeCallback)
    this.noise2d.addToGUI(folder, changeCallback)
  }

  serialize(): TerrainGeneratorParams {
    return { hilliness: this.hilliness, seed: this.seed, fractalNoiseParams: this.noise2d.serialize(), grassLevel: this.grassLevel, dirtLevel: this.dirtLevel}
  }

  deserialize(data: TerrainGeneratorParams) {
    this.seed = data.seed
    this.hilliness = data.hilliness
    this.grassLevel = data.grassLevel
    this.dirtLevel = data.dirtLevel

    this.noise2d.deserialize(data.fractalNoiseParams)
  }
}
