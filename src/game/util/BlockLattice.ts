import * as THREE from 'three'

export class BlockLattice {
  public data: THREE.TypedArray

  constructor(public readonly dimensions: THREE.Vector3, defaultValue: number = 0) {
    this.data = new Uint8Array(dimensions.x * dimensions.y * dimensions.z).fill(
      defaultValue
    )
  }

  get(position: THREE.Vector3) {
    return this.data[this.getIndex(position)]
  }

  set(position: THREE.Vector3, value: number) {
    this.data[this.getIndex(position)] = value
  }

  getIndex(position: THREE.Vector3): number {
    return position.x + this.dimensions.x * (position.y + this.dimensions.y * position.z)
  }
}
