import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { TerrainGenerator } from './TerrainGenerator'

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
  public static readonly SIZE = 32
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  public static fromMessageData(data: ChunkMessageData) {
    const { position, dimensions, generatorSeed } = data
    const { x, y, z } = position
    const { width, height, depth } = dimensions

    const chunk = new Chunk(
      new TerrainGenerator(generatorSeed),
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(width, height, depth)
    )
    return chunk
  }

  constructor(
    public readonly terrainGenerator: TerrainGenerator,
    public readonly position: THREE.Vector3,
    public readonly dimensions: THREE.Vector3
  ) {
    this.chunkData = new ChunkData(
      this.dimensions.x,
      this.dimensions.y,
      this.dimensions.z
    )
    this.chunkMesher = new ChunkMesher(
      this.chunkData.width,
      this.chunkData.height,
      this.chunkData.depth,
      (x: number, y: number, z: number) => this.chunkData.get(x, y, z)
    )
    this.mesh = new THREE.Mesh()
    this.mesh.position.set(
      this.position.x * this.chunkData.width,
      this.position.y * this.chunkData.height,
      this.position.z * this.chunkData.depth
    )
    this.mesh.material = new THREE.MeshMatcapMaterial()
  }

  generateTerrain() {
    for (let x = -1; x < this.chunkData.width + 1; x++) {
      for (let y = -1; y < this.chunkData.height + 1; y++) {
        for (let z = -1; z < this.chunkData.depth + 1; z++) {
          const block = this.terrainGenerator.getBlock(
            x + this.position.x * this.chunkData.width,
            y + this.position.y * this.chunkData.height,
            z + this.position.z * this.chunkData.depth
          )
          this.chunkData.set(x, y, z, block)
        }
      }
    }
  }

  generateWorkerTask() {
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
      this.chunkData.data.data = new Uint8Array(message.data)
    }

    return { message, callback }
  }

  // @Benchmark
  updateMeshGeometry() {
    const geometry = this.chunkMesher.generateGeometry()
    this.mesh.geometry = geometry
  }
}
