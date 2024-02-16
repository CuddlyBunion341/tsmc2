import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { TerrainGenerator } from './TerrainGenerator'

export type ChunkOptions = {
  terrainGenerator: TerrainGenerator
  position: THREE.Vector3
  dimensions: THREE.Vector3
  materials: THREE.Material[]
}

export type ChunkMessageData = {
  position: {
    x: number
    y: number
    z: number
  }
  dimensions: {
    width: number
    height: number
    depth: number
  }
  generatorSeed: number
}

export class Chunk {
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh
  public readonly terrainGenerator: TerrainGenerator
  public readonly position: THREE.Vector3
  public readonly dimensions: THREE.Vector3
  public readonly materials: THREE.Material[]


  public static fromMessageData(data: ChunkMessageData) {
    const { position, dimensions, generatorSeed } = data
    const { x, y, z } = position
    const { width, height, depth } = dimensions

    const chunk = new Chunk(
      {
        terrainGenerator: new TerrainGenerator(generatorSeed),
        position: new THREE.Vector3(x, y, z),
        dimensions: new THREE.Vector3(width, height, depth),
        materials: []
      }
    )
    return chunk
  }

  constructor(
    options: ChunkOptions
  ) {
    const { terrainGenerator, position, dimensions, materials } = options

    this.terrainGenerator = terrainGenerator
    this.position = position
    this.dimensions = dimensions
    this.materials = materials

    this.chunkData = new ChunkData(dimensions)
    this.chunkMesher = new ChunkMesher(dimensions, this.chunkData)
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.materials)
    this.mesh.position.add(this.position.clone().multiply(this.dimensions))
  }

  generateTerrain() {
    const chunkPosition = new THREE.Vector3(0, 0, 0)

    for (let x = -1; x < this.dimensions.x + 1; x++) {
      for (let y = -1; y < this.dimensions.y + 1; y++) {
        for (let z = -1; z < this.dimensions.z + 1; z++) {
          chunkPosition.set(x, y, z)
          const worldPosition = chunkPosition
            .clone()
            .add(this.position.clone().multiply(this.dimensions))

          const block = this.terrainGenerator.getBlock(worldPosition)
          this.chunkData.set(chunkPosition, block)
        }
      }
    }
  }

  generateTerrainGenerationWorkerTask() {
    const message = {
      position: { x: this.position.x, y: this.position.y, z: this.position.z },
      dimensions: {
        width: this.dimensions.x,
        height: this.dimensions.y,
        depth: this.dimensions.z
      },
      generatorSeed: this.terrainGenerator.seed
    }

    const callback = (message: MessageEvent<ArrayBuffer>) => {
      this.chunkData.data = new Uint8Array(message.data)
    }

    return { message, callback }
  }

  // @Benchmark
  updateMeshGeometry() {
    const geometry = this.chunkMesher.generateGeometry()
    this.mesh.geometry = geometry
  }
}
