import * as THREE from 'three'

export class InstancedOakLeaves {
  public instancedMesh: THREE.InstancedMesh
  public instanceCount = 0

  constructor(public maxInstanceCount = 1000) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 , opacity: 0.5, transparent: true })
    this.instancedMesh = new THREE.InstancedMesh(boxGeometry, material, maxInstanceCount)
  }

  public createInstance(position: THREE.Vector3) {
    if (++this.instanceCount > this.maxInstanceCount) throw new Error('Max instance count exceeded')

    const matrix = new THREE.Matrix4()
    matrix.makeTranslation(position.x, position.y, position.z)

    this.instancedMesh.setMatrixAt(this.instanceCount - 1, matrix)
  }
}
