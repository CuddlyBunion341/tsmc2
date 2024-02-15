import * as THREE from 'three'

import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { WorkerManager } from './world/workers/WorkerPool'
import { ChunkMessageData } from './world/Chunk'
import { InstancedOakLeaves } from './world/InstancedOakLeaves'

export default class Game implements Experience {
  resources: Resource[] = []

  public oakLeaves!: InstancedOakLeaves

  constructor(private engine: Engine) {}

  addPlane() {
    const d = 18
    for (let x = 0; x < d; x++) {
      for (let y = 0; y < d; y++) {
        const color = Math.random() * 0xffffff
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(32, 32),
          new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, opacity: 0.5, transparent: true, depthWrite: false, depthTest: true})
        )
        plane.renderOrder = 1
    plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
        plane.position.set((x - d / 2) * 32, 0, (y - d / 2) * 32)
        this.engine.scene.add(plane)

        console.log(plane.renderOrder)
      }
    }
  }

  @Benchmark
  init(): void {
    this.addOakLeaves()
    this.addPlane()

    document.addEventListener('keyup', event => {
      if (event.key === 'i') {
        this.oakLeaves.sortInstances(this.engine.camera.instance)
      }
    })

    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, new THREE.Vector3(8, 2, 8))

    const chunks = chunkManager.createChunksAroundOrigin(new THREE.Vector3(0, 0, 0))

    const workerPath = './src/game/world/workers/TerrainGenerationWorker.ts'
    const workerCount = navigator.hardwareConcurrency

    const workerManager = new WorkerManager<ChunkMessageData, ArrayBuffer>(
      workerPath,
      workerCount
    )

    chunks.forEach((chunk) => {
      this.engine.scene.add(chunk.mesh)

      const task = chunk.generateTerrainGenerationWorkerTask()

      workerManager.enqueueTask({
        message: task.message,
        callback: (args: MessageEvent<ArrayBuffer>) => {
          task.callback(args)
          chunk.updateMeshGeometry()
        }
      })
    })
  }

  addOakLeaves() {
    const cubeSide = 20
    const offset = 1
    const oakLeaves = new InstancedOakLeaves(cubeSide * cubeSide * cubeSide)
    this.oakLeaves = oakLeaves
    this.engine.scene.add(oakLeaves.instancedMesh)

    for (let x = 0; x < cubeSide; x++) {
      for (let y = 0; y < cubeSide; y++) {
        for (let z = 0; z < cubeSide; z++) {
          const mesh = oakLeaves.createInstance(new THREE.Vector3(x * offset, y * offset - 5, z * offset))
          this.engine.scene.add(mesh)
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
  }

  resize?(): void {}
}
