import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { TerrainGenerator } from './TerrainGenerator'

export class Chunk {
  public static readonly SIZE = 32
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  constructor(
    public readonly terrainGenerator: TerrainGenerator,
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {
    this.chunkData = new ChunkData(Chunk.SIZE, Chunk.SIZE, Chunk.SIZE)
    this.chunkMesher = new ChunkMesher(
      this.chunkData.width,
      this.chunkData.height,
      this.chunkData.depth,
      (x: number, y: number, z: number) => this.chunkData.get(x, y, z)
    )
    this.mesh = new THREE.Mesh()
    this.mesh.position.set(
      this.x * this.chunkData.width,
      this.y * this.chunkData.height,
      this.z * this.chunkData.depth
    )
    this.mesh.material = new THREE.MeshMatcapMaterial()
  }

  prepareGeneratorWorkerData() {
    const payload = {
      chunkX: this.x,
      chunkY: this.y,
      chunkZ: this.z,
      chunkWidth: this.chunkData.width,
      chunkHeight: this.chunkData.height,
      chunkDepth: this.chunkData.depth,
      terrainGeneratorSeed: this.terrainGenerator.seed
    }

    const callback = (payload: { data: { chunkData: number[] } }) => {
      this.chunkData.data.data = payload.data.chunkData
    }

    return { payload, callback }
  }

  // @Benchmark
  updateMeshGeometry() {
    const geometry = this.chunkMesher.generateGeometry()
    this.mesh.geometry = geometry
  }
}
