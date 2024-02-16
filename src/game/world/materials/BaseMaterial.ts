import * as THREE from 'three'

export class BaseMaterial {
  material: THREE.MeshBasicMaterial

  constructor() {
    this.material = new THREE.MeshBasicMaterial({vertexColors: true})
  }
}
