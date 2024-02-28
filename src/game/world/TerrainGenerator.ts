import * as THREE from 'three'
import { FractalNoise2d } from '../utilities/FractalNoise2d'
import { blockIds } from './blocks'
import type GUI from 'lil-gui'
import { linearSplineInterpolation } from '../utilities/Math'
import type { FractalNoiseParams } from '../utilities/FractalNoiseBase'
import { FractalNoise3d } from '../utilities/FractalNoise3d'

// Inspired by: https://www.youtube.com/watch?v=CSa5O6knuwI

export type TerrainGeneratorParams = {
  seed: number
  hilliness: number
  continentalnessNoiseParams: FractalNoiseParams
  densityNoiseParams: FractalNoiseParams
  caveNoise: FractalNoiseParams
  grassLevel: number
  dirtLevel: number
  terrainHeightSplines: number[][]
  squashingFactor: number
  caveAirThreshold: number
}

const vec2 = new THREE.Vector2()
const vec3 = new THREE.Vector3()

export class TerrainGenerator {

  public continentalness: FractalNoise2d
  public density: FractalNoise3d
  public caveNoise: FractalNoise3d
  public hilliness: number
  public grassLevel: number
  public dirtLevel: number
  public terrainHeightSplines: number[][]
  public squashingFactor: number
  public caveAirThreshold: number


  public constructor(public seed: number) {
    this.continentalness = new FractalNoise2d({
      name: "Continentalness",
      seed,
      octaves: 5,
      frequency: 137,
      persistence: 1.6,
      amplitude: 1,
      lacunarity: 1.6
    })

    this.density = new FractalNoise3d({
      name: "Density",
      seed,
      octaves: 4,
      frequency: 137,
      persistence: 1.6,
      amplitude: 1,
      lacunarity: 1.6
    })

    this.caveNoise = new FractalNoise3d({
      name: "Cave Noise",
      seed,
      octaves: 4,
      frequency: 137,
      persistence: 1.6,
      amplitude: 1,
      lacunarity: 1.6
    })

    this.hilliness = 6
    this.grassLevel = 18
    this.dirtLevel = 12
    this.squashingFactor = 50
    this.caveAirThreshold = 0.5

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

    const densityValue = this.density.get(vec3.set(x,y,z))

    if (densityValue < y / this.squashingFactor) return blockIds.air

    const caveNoiseValue = this.caveNoise.get(vec3.set(x,y,z))

    if (caveNoiseValue > this.caveAirThreshold) return blockIds.air

    return blockIds.stone

    // const continentalnessValue = this.continentalness.get(vec2.set(x,z))

    // const splineValue = linearSplineInterpolation(continentalnessValue, this.terrainHeightSplines)

    // const height = splineValue * this.hilliness

    // if (y > height) return blockIds.air
    // if (y > this.grassLevel) return blockIds.grass
    // if (y > this.dirtLevel) return blockIds.dirt

    // return blockIds.stone
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
    folder.add(this, 'squashingFactor', -50, 100, 1).onChange(changeCallback)
    this.continentalness.addToGUI(folder, changeCallback)
    this.density.addToGUI(folder, changeCallback)
    this.caveNoise.addToGUI(folder, changeCallback)
    folder.add(this, 'caveAirThreshold', -1, 1, 0.01).onChange(changeCallback)
  }

  public serialize(): TerrainGeneratorParams {
    return {
      seed: this.seed,
      hilliness: this.hilliness,
      grassLevel: this.grassLevel,
      dirtLevel: this.dirtLevel,
      terrainHeightSplines: this.terrainHeightSplines,
      squashingFactor: this.squashingFactor,
      continentalnessNoiseParams: this.continentalness.serialize(),
      densityNoiseParams: this.density.serialize(),
      caveNoise: this.caveNoise.serialize(),
      caveAirThreshold: this.caveAirThreshold
    }
  }

  public deserialize(data: TerrainGeneratorParams) {
    this.seed = data.seed
    this.hilliness = data.hilliness
    this.grassLevel = data.grassLevel
    this.dirtLevel = data.dirtLevel
    this.terrainHeightSplines = data.terrainHeightSplines
    this.squashingFactor = data.squashingFactor
    this.caveAirThreshold = data.caveAirThreshold

    this.continentalness.deserialize(data.continentalnessNoiseParams)
    this.density.deserialize(data.densityNoiseParams)
    this.caveNoise.deserialize(data.caveNoise)
  }
}
