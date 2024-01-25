import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { TerrainGenerator } from './TerrainGenerator'
import { Matrix3d } from '../util/Matrix3d'

export class Chunk {
  public static readonly SIZE = 32
  public readonly chunkData: Matrix3d<Uint8Array>
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  constructor(
    public readonly terrainGenerator: TerrainGenerator,
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {
    this.chunkData = new Matrix3d(Chunk.SIZE, Chunk.SIZE, Chunk.SIZE, Uint8Array)
    this.chunkMesher = new ChunkMesher(
      this.chunkData.width,
      this.chunkData.height,
      this.chunkData.depth,
      this.chunkData.list
    )

    this.mesh = new THREE.Mesh()
    this.mesh.position.set(this.x, this.y, this.z)
  }

  // @Benchmark
  generateData() {
    // TODO: extract into web worker

    for (let x = 0; x < this.chunkData.width; x++) {
      for (let y = 0; y < this.chunkData.height; y++) {
        for (let z = 0; z < this.chunkData.depth; z++) {
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
