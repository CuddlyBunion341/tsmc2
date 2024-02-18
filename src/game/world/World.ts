import * as THREE from "three";
import { ChunkMessageData } from "./Chunk";
import { ChunkManager } from "./ChunkManager";
import { TerrainGenerator } from "./TerrainGenerator";
import { WorkerManager } from "./workers/WorkerPool";
import TerrainGenerationWorker from './workers/TerrainGenerationWorker.ts?worker'
import GUI from "lil-gui";

export class World {
  readonly terrainGenerator: TerrainGenerator
  readonly chunkManager: ChunkManager
  readonly workerManager: WorkerManager<ChunkMessageData, ArrayBuffer>
  readonly renderDistance: THREE.Vector3

  constructor(seed: number, renderDistance: THREE.Vector3) {
    this.terrainGenerator = new TerrainGenerator(seed)
    this.renderDistance = renderDistance
    this.chunkManager = new ChunkManager(this.terrainGenerator, this.renderDistance)

    this.workerManager = new WorkerManager<ChunkMessageData, ArrayBuffer>(
      TerrainGenerationWorker,
      navigator.hardwareConcurrency
    )
  }

  addToGUI(gui: GUI, changeCallback: () => void) {
    const renderDistanceFolder = gui.addFolder("Render Distance")
    renderDistanceFolder.add(this.renderDistance, "x", 0, 16, 1).onChange(changeCallback)
    renderDistanceFolder.add(this.renderDistance, "y", 0, 16, 1).onChange(changeCallback)
    renderDistanceFolder.add(this.renderDistance, "z", 0, 16, 1).onChange(changeCallback)

    this.terrainGenerator.addToGUI(gui, changeCallback)
  }

  clearWorkerTasks() {
    this.workerManager.clearQueue()
  }

  generate() {
    const chunks = this.chunkManager.createChunksAroundOrigin(new THREE.Vector3(0, 0, 0))

    chunks.forEach((chunk) => {
      const task = chunk.generateTerrainGenerationWorkerTask()

      this.workerManager.enqueueTask({
        message: task.message,
        callback: (args: MessageEvent<ArrayBuffer>) => {
          task.callback(args)
          chunk.updateMeshGeometry()
        }
      })
    })

    return chunks
  }
}
