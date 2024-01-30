import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { Benchmark } from './utilities/Benchmark'
import { ChunkManager } from './world/ChunkManager'
import { TerrainGenerator } from './world/TerrainGenerator'
import { DistanceField } from './world/raymarcher/DistanceField'
import { WorkerManager } from './world/workers/WorkerManager'

export default class Game implements Experience {
  resources: Resource[] = []

  constructor(private engine: Engine) { }

  @Benchmark
  init(): void {
    const terrainGenerator = new TerrainGenerator(69420)
    const chunkManager = new ChunkManager(terrainGenerator, 0, 0, 0)

    const chunks = chunkManager.createChunksAroundOrigin(0, -1, 0)

    const workerPath = './src/game/world/workers/TerrainGenerationWorker.ts'
    const workerManager = new WorkerManager(workerPath, 1)

    const chunk = chunks[0]
    this.engine.scene.add(chunk.mesh)

    const task = chunk.prepareGeneratorWorkerData()

    workerManager.enqueueTask({
      payload: task.payload,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (args: any) => {
        task.callback(args)
        // chunk.updateMeshGeometry()

        const distanceField = new DistanceField(chunk.chunkData.data, 4, 20)
        distanceField.calculateDistanceField()

        const src = distanceField.getTexture()
        const image = new Image()
        image.src = src

        document.body.appendChild(image)
        image.setAttribute('style', 'position: absolute; height: 50%; left: 0; top: 0; border: 1px solid red; image-rendering: pixelated; ')
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void { }

  resize?(): void { }
}
