import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { World } from './world/World'
import { Chunk } from './world/Chunk'

export default class Game implements Experience {
  public resources: Resource[] = []

  private world: World

  public constructor(private engine: Engine) {
    this.world = new World(69420, new THREE.Vector3(8, 2, 8))
   }

  @Benchmark
  public init(): void {
    this.generateWorld()
    this.world.addToGUI(this.engine.debug.gui, () => this.generateWorld())
  }

  public generateWorld() {
    const oldChunkMeshes = this.engine.scene.children.filter(child => child.name === Chunk.meshName)
    oldChunkMeshes.forEach(mesh => this.engine.scene.remove(mesh))

    this.world.clearWorkerTasks()

    const chunks = this.world.generate()
    chunks.forEach(chunk => this.engine.scene.add(chunk.mesh))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(delta: number): void {}

  public resize?(): void {}
}
