import * as THREE from 'three'
import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Chunk } from './world/Chunk'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) {}

  init(): void {
    const chunk = new Chunk(0, 0, 0)
    chunk.generateData()
    chunk.updateMeshGeometry()

    this.engine.scene.add(chunk.mesh)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}

  resize?(): void {}
}
