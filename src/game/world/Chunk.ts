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
    this.chunkData = new ChunkData(dimensions)
    this.chunkMesher = new ChunkMesher(dimensions, this.chunkData)
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), [
      new THREE.MeshBasicMaterial({vertexColors: true}),
      new THREE.MeshBasicMaterial({color: 0x0000ff, opacity: 0.5, transparent: true, side: THREE.DoubleSide})
    ])
    this.mesh.position.add(this.position.clone().multiply(this.dimensions))
  }

  generateTerrain() {
    const chunkPosition = new THREE.Vector3(0,0,0)

    for (let x = -1; x < this.dimensions.x + 1; x++) {
      for (let y = -1; y < this.dimensions.y + 1; y++) {
        for (let z = -1; z < this.dimensions.z + 1; z++) {
          chunkPosition.set(x,y,z)
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
