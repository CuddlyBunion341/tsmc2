import * as THREE from 'three';
import { Engine } from '../engine/Engine';
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources';

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) { }

  init(): void {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    )

    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true

    this.engine.scene.add(plane)
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.castShadow = true
    directionalLight.position.set(2, 2, 2)
    this.engine.scene.add(directionalLight)

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    )
    cube.position.set(0, 0.5, 0)
    cube.castShadow = true

    this.engine.scene.add(cube)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void { }

  resize?(): void { }
}
