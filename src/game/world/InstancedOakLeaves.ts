import * as THREE from 'three'
import { Benchmark } from '../utilities/Benchmark'

export class InstancedOakLeaves {
  public instancedMesh: THREE.InstancedMesh
  public instanceCount = 0

  constructor(public maxInstanceCount = 1000) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const texture = new THREE.TextureLoader().load('src/game/resources/textures/oak_leaves.png')
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.colorSpace = THREE.DisplayP3ColorSpace 
    const commonMaterialProperties = { opacity: 1, map: texture, transparent: true, depthWrite: true, depthTest: true }
    const material = new THREE.MeshBasicMaterial({ ...commonMaterialProperties, side: THREE.FrontSide })
    this.instancedMesh = new THREE.InstancedMesh(boxGeometry, material, maxInstanceCount)
    // this.instancedMesh.renderOrder = 999
  }

  public createInstance(position: THREE.Vector3) {
    if (++this.instanceCount > this.maxInstanceCount) throw new Error('Max instance count exceeded')

    // const matrix = new THREE.Matrix4()
    // matrix.makeTranslation(position.x, position.y, position.z)

    // this.instancedMesh.setMatrixAt(this.instanceCount - 1, matrix)

    const mesh = new THREE.Mesh(this.instancedMesh.geometry, this.instancedMesh.material)
    mesh.position.copy(position)
    return mesh
  }

  public resetInstances() {
    this.instanceCount = 0
    this.instancedMesh.count = 0
  }

  @Benchmark
  public sortInstances(camera: THREE.Camera) {
    // generated with copilot

    const cameraPosition = new THREE.Vector3()
    camera.getWorldPosition(cameraPosition)

    const instancePositions: THREE.Vector3[] = []
    const instanceDistances: number[] = []

    // Get the positions and distances of all instances
    for (let i = 0; i < this.instanceCount; i++) {
      const instanceMatrix = new THREE.Matrix4()
      this.instancedMesh.getMatrixAt(i, instanceMatrix)

      const instancePosition = new THREE.Vector3()
      instanceMatrix.decompose(instancePosition,  new THREE.Quaternion(), new THREE.Vector3())

      const distance = instancePosition.distanceTo(cameraPosition)

      instancePositions.push(instancePosition)
      instanceDistances.push(distance)
    }

    // Sort the instances based on distance
    for (let i = 0; i < this.instanceCount - 1; i++) {
      for (let j = i + 1; j < this.instanceCount; j++) {
        if (instanceDistances[j] > instanceDistances[i]) {
          // Swap positions
          const tempPosition = instancePositions[i]
          instancePositions[i] = instancePositions[j]
          instancePositions[j] = tempPosition

          // Swap distances
          const tempDistance = instanceDistances[i]
          instanceDistances[i] = instanceDistances[j]
          instanceDistances[j] = tempDistance
        }
      }
    }

    // Update the instance positions in the instancedMesh
    for (let i = 0; i < this.instanceCount; i++) {
      const instanceMatrix = new THREE.Matrix4()
      instanceMatrix.makeTranslation(instancePositions[i].x, instancePositions[i].y, instancePositions[i].z)
      this.instancedMesh.setMatrixAt(i, instanceMatrix)
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true
  }
}
