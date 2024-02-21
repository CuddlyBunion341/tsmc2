import type * as THREE from 'three'
import { BlockLattice } from '../util/BlockLattice'

export class ChunkData extends BlockLattice {
  public constructor(dimensions: THREE.Vector3) {
    super(dimensions.clone().addScalar(2), 0)
  }

  public getIndex(blockPosition: THREE.Vector3) {
    return super.getIndex(blockPosition.clone().addScalar(1))
  }
}
