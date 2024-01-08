import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { blockIds } from './blocks'

export class Chunk {
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {
    this.chunkData = new ChunkData()
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
    this.mesh.material = new THREE.MeshNormalMaterial()
  }

  generateData() {
    for (let x = -1; x <= this.chunkData.width; x++) {
      for (let y = -1; y <= this.chunkData.height; y++) {
        for (let z = -1; z <= this.chunkData.depth; z++) {
          const block = Math.random() < 0.1 ? blockIds.stone : blockIds.air
          this.chunkData.set(x, y, z, block)
        }
      }
    }
  }

  updateMeshGeometry() {
    // const geometry = this.chunkMesher.generateGeometry()
    // this.mesh.geometry = geometry

    this.mesh.geometry = this.chunkMesher.exampleCube().geometry
  }
}
