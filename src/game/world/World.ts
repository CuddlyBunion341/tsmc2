import * as THREE from "three";
import type { ChunkMessageData } from "./Chunk";
import { ChunkManager } from "./ChunkManager";
import { TerrainGenerator } from "./TerrainGenerator";
import { WorkerManager } from "./workers/WorkerPool";
import TerrainGenerationWorker from './workers/TerrainGenerationWorker.ts?worker'
import type GUI from "lil-gui";

export class World {
  private readonly terrainGenerator: TerrainGenerator
  private readonly chunkManager: ChunkManager
  private readonly workerManager: WorkerManager<ChunkMessageData, ArrayBuffer>
  private readonly renderDistance: THREE.Vector3

  public constructor(seed: number, renderDistance: THREE.Vector3) {
    this.terrainGenerator = new TerrainGenerator(seed)
    this.renderDistance = renderDistance
    this.chunkManager = new ChunkManager(this.terrainGenerator, this.renderDistance)

    this.workerManager = new WorkerManager<ChunkMessageData, ArrayBuffer>(
      TerrainGenerationWorker,
      navigator.hardwareConcurrency
    )
  }

  public addToGUI(gui: GUI, changeCallback: () => void) {
    const renderDistanceFolder = gui.addFolder("Render Distance")
    renderDistanceFolder.add(this.renderDistance, "x", 0, 16, 1).onChange(changeCallback)
    renderDistanceFolder.add(this.renderDistance, "y", 0, 16, 1).onChange(changeCallback)
    renderDistanceFolder.add(this.renderDistance, "z", 0, 16, 1).onChange(changeCallback)

    this.terrainGenerator.addToGUI(gui, changeCallback)
  }

  public clearWorkerTasks() {
    this.workerManager.clearQueue()
  }

  public generate() {
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
