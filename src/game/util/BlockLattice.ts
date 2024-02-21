import * as THREE from 'three'

export class BlockLattice {
  public data: THREE.TypedArray

  public constructor(public readonly dimensions: THREE.Vector3, defaultValue: number = 0) {
    this.data = new Uint8Array(dimensions.x * dimensions.y * dimensions.z).fill(
      defaultValue
    )
  }

  public get(position: THREE.Vector3) {
    return this.data[this.getIndex(position)]
  }

  public set(position: THREE.Vector3, value: number) {
    this.data[this.getIndex(position)] = value
  }

  public getIndex(position: THREE.Vector3) {
    return position.x + this.dimensions.x * (position.y + this.dimensions.y * position.z)
  }
}
