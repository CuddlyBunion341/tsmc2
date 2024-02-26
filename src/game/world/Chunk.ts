import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import type { TerrainGeneratorParams } from './TerrainGenerator';
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
  generatorParams: TerrainGeneratorParams
}

export class Chunk {
  public static readonly meshName = "Chunk"
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  public constructor(
    public readonly terrainGenerator: TerrainGenerator,
    public readonly position: THREE.Vector3,
    public readonly dimensions: THREE.Vector3
  ) {
    this.chunkData = new ChunkData(dimensions)
    this.chunkMesher = new ChunkMesher(dimensions, this.chunkData)
    this.mesh = new THREE.Mesh()
    this.mesh.name = Chunk.meshName
    this.mesh.position.add(this.position.clone().multiply(this.dimensions))
    this.mesh.material = new THREE.MeshBasicMaterial({vertexColors: true})
  }

  public static fromMessageData(data: ChunkMessageData) {
    const { position, dimensions, generatorParams } = data
    const { x, y, z } = position
    const { width, height, depth } = dimensions

    const terrainGenerator = TerrainGenerator.fromMessageData(generatorParams)

    const chunk = new Chunk(
      terrainGenerator,
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(width, height, depth)
    )
    return chunk
  }

  public generateTerrain() {
    const chunkPosition = this.position.clone().multiply(this.dimensions)
    const blockWorldPosition = new THREE.Vector3(0,0,0)
    const blockChunkPosition = new THREE.Vector3(0,0,0)

    for (let x = -1; x < this.dimensions.x + 1; x++) {
      for (let y = -1; y < this.dimensions.y + 1; y++) {
        for (let z = -1; z < this.dimensions.z + 1; z++) {
          blockChunkPosition.set(x,y,z)
          blockWorldPosition.set(x,y,z).add(chunkPosition)

          const block = this.terrainGenerator.getBlock(blockWorldPosition)
          this.chunkData.set(blockChunkPosition, block)
        }
      }
    }
  }

  public generateTerrainGenerationWorkerTask() {
    const message: ChunkMessageData = {
      position: { x: this.position.x, y: this.position.y, z: this.position.z },
      dimensions: {
        width: this.dimensions.x,
        height: this.dimensions.y,
        depth: this.dimensions.z
      },
      generatorParams: this.terrainGenerator.serialize()
    }

    const callback = (message: MessageEvent<ArrayBuffer>) => {
      this.chunkData.data = new Uint8Array(message.data)
    }

    return { message, callback }
  }

  // @Benchmark
  public updateMeshGeometry() {
    const geometry = this.chunkMesher.generateGeometry()
    this.mesh.geometry = geometry
  }
}
