import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { World } from './world/World'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) { }

  @Benchmark
  init(): void {
    const world = new World(69420, new THREE.Vector3(8, 2, 8))
    const chunks = world.generate()
    chunks.forEach(chunk => this.engine.scene.add(chunk.mesh))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}

  resize?(): void {}
}
