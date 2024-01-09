import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'
import { blockIds } from './blocks'

export class Chunk {
  public static readonly SIZE = 32
  public readonly chunkData: ChunkData
  public readonly chunkMesher: ChunkMesher
  public readonly mesh: THREE.Mesh

  constructor(
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
    this.mesh.material = new THREE.MeshBasicMaterial({ wireframe: true })
  }

  generateData() {
    // The border was initialized to 0, so we only need to set the interior blocks
    for (let x = 0; x < this.chunkData.width; x++) {
      for (let y = 0; y < this.chunkData.height; y++) {
        for (let z = 0; z < this.chunkData.depth; z++) {
          const block = blockIds.stone
          this.chunkData.set(x, y, z, block)
        }
      }
    }
  }

  updateMeshGeometry() {
    const geometry = this.chunkMesher.generateGeometry()
    this.mesh.geometry = geometry
  }
}
