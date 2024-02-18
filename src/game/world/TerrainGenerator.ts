import * as THREE from 'three'
import { FractalNoise2d, FractalNoise2dParams } from '../utilities/Noise'
import { blockIds } from './blocks'
import GUI from 'lil-gui'
import { Serializable } from '../utilities/Serializable'
import { linearSplineInterpolation } from '../utilities/Math'

export type TerrainGeneratorParams = {
  seed: number
  hilliness: number
  fractalNoiseParams: FractalNoise2dParams
  grassLevel: number
  dirtLevel: number
}

export class TerrainGenerator implements Serializable<TerrainGeneratorParams> {

  public continentalness: FractalNoise2d
  public hilliness: number
  public grassLevel: number
  public dirtLevel: number
  public terrainHeightSplines: number[][]


  constructor(public seed: number) {
    this.continentalness = new FractalNoise2d({
      seed,
      octaves: 5,
      frequency: 137,
      persistence: 1.6,
      amplitude: 1,
      lacunarity: 1.6
    })

    this.hilliness = 5
    this.grassLevel = 73
    this.dirtLevel = 49

    this.terrainHeightSplines = [
      [-1, 5],
      [0.3, 10],
      [0.4, 15],
      [1, 16],
    ]
  }

  public static fromMessageData(data: TerrainGeneratorParams) {
    const generator = new TerrainGenerator(data.seed)
    generator.deserialize(data)
    return generator
  }

  public getBlock(blockPosition: THREE.Vector3) {
    const { x, y, z } = blockPosition

    const continentalnessValue = this.continentalness.get(x, z)

    const splineValue = linearSplineInterpolation(continentalnessValue, this.terrainHeightSplines)

    const height = splineValue * this.hilliness

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
    this.continentalness.addToGUI(folder, changeCallback)
  }

  serialize() {
    return { hilliness: this.hilliness, seed: this.seed, fractalNoiseParams: this.continentalness.serialize(), grassLevel: this.grassLevel, dirtLevel: this.dirtLevel}
  }

  deserialize(data: TerrainGeneratorParams) {
    this.seed = data.seed
    this.hilliness = data.hilliness
    this.grassLevel = data.grassLevel
    this.dirtLevel = data.dirtLevel

    this.continentalness.deserialize(data.fractalNoiseParams)
  }
}
