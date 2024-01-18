import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { TerrainGenerator } from './TerrainGenerator'
import { blockIds } from './blocks'
import { voxelMaterial } from './raytracer/voxelMaterial'

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
      this.chunkData.data.list
    )

    this.mesh = new THREE.Mesh()
    this.mesh.material = voxelMaterial
    this.mesh.position.set(
      this.x * this.chunkData.width,
      this.y * this.chunkData.height,
      this.z * this.chunkData.depth
    )
    this.mesh.material = new THREE.MeshMatcapMaterial()
  }

  // @Benchmark
  generateData() {
    // TODO: extract into web worker

    for (let x = -1; x < this.chunkData.width + 1; x++) {
      for (let y = -1; y < this.chunkData.height + 1; y++) {
        for (let z = -1; z < this.chunkData.depth + 1; z++) {
          const block = this.terrainGenerator.getBlock(
            x + this.x * this.chunkData.width,
            y + this.y * this.chunkData.height,
            z + this.z * this.chunkData.depth
          )

          this.chunkData.set(x, y, z, block)
        }
      }
    }
  }

  // @Benchmark
  updateMeshGeometry() {
    const mesh = this.chunkMesher.generateMesh()
    this.mesh.geometry = mesh.geometry
    this.mesh.material = mesh.material
  }
}
