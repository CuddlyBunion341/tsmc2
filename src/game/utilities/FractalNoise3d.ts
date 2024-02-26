import type { NoiseFunction3D} from "simplex-noise";
import { createNoise3D } from "simplex-noise"
import type { FractalNoiseParams} from "./FractalNoiseBase";
import { FractalNoiseBase, createSeededRandomizer } from "./FractalNoiseBase"
import type { Vector3 } from "three";

export class FractalNoise3d extends FractalNoiseBase<Vector3> {
  declare private noiseFunction: NoiseFunction3D

  public constructor(params: FractalNoiseParams) {
    super(params)
  }

  public deserialize(data: FractalNoiseParams) {
    super.deserialize(data)

    this.noiseFunction = createNoise3D(createSeededRandomizer(data.seed))
  }

  protected noiseFunctionValue(position: Vector3) {
    return this.noiseFunction(position.x, position.y, position.z)
  }
}
