import * as THREE from 'three'
import { VoxelGrid } from '../util/BlockLattice'

export class ChunkData extends VoxelGrid {
  constructor(dimensions: THREE.Vector3) {
    super(dimensions.clone().addScalar(2), 0)
  }

  getIndex(blockPosition: THREE.Vector3) {
    return super.getIndex(blockPosition.clone().addScalar(1))
  }
}
