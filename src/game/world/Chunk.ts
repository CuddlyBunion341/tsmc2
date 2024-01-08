import { ChunkData } from './ChunkData'
import { ChunkMesher } from './ChunkMesher'
import * as THREE from 'three'

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
      this.chunkData.get
    )
    this.mesh = new THREE.Mesh()
  }
}
