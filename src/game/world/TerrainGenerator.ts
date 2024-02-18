import * as THREE from 'three'
import { FractalNoise2d, FractalNoise2dParams } from '../utilities/Noise'
import { blockIds } from './blocks'
import GUI from 'lil-gui'
import { linearSplineInterpolation } from '../utilities/Math'

export type TerrainGeneratorParams = {
  seed: number
  hilliness: number
  fractalNoiseParams: FractalNoise2dParams
  grassLevel: number
  dirtLevel: number
  terrainHeightSplines: number[][]
}

export class TerrainGenerator {

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

    this.hilliness = 6
    this.grassLevel = 18
    this.dirtLevel = 12

    this.terrainHeightSplines = [
      [-1, 3],
      [0, 4],
      [0.5, -1],
      [0.6, -1],
      [1, 3],
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

  public addToGUI(gui: GUI, changeCallback: () => void) {
    const folder = gui.addFolder('Terrain Generator')
    folder.add(this, 'hilliness', 1, 100, 1).onChange(changeCallback)
    folder.add(this, 'grassLevel', -50, 100, 1).onChange(changeCallback)
    folder.add(this, 'dirtLevel', -50, 100, 1).onChange(changeCallback)
    const splines = folder.addFolder('Terrain Height Splines')
    this.terrainHeightSplines.forEach((_, i) => {
      const splineFolder = splines.addFolder(`Spline ${i}`)
      splineFolder.add(this.terrainHeightSplines[i], '0', -1, 1, 0.1).name('X').onChange(changeCallback)
      splineFolder.add(this.terrainHeightSplines[i], '1', -1, 100, 1).name('Y').onChange(changeCallback)
    })
    this.continentalness.addToGUI(folder, changeCallback)
  }

  public serialize(): TerrainGeneratorParams {
    return {
      seed: this.seed,
      hilliness: this.hilliness,
      grassLevel: this.grassLevel,
      dirtLevel: this.dirtLevel,
      terrainHeightSplines: this.terrainHeightSplines,
      fractalNoiseParams: this.continentalness.serialize(),
    }
  }

  public deserialize(data: TerrainGeneratorParams) {
    this.seed = data.seed
    this.hilliness = data.hilliness
    this.grassLevel = data.grassLevel
    this.dirtLevel = data.dirtLevel
    this.terrainHeightSplines = data.terrainHeightSplines

    this.continentalness.deserialize(data.fractalNoiseParams)
  }
}
