import * as THREE from 'three'
import { voxelMaterial } from './raymarcher/voxelMaterial'

export type Vertex = {
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
}

export class ChunkMesher {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly voxelData: Uint8Array
  ) {}

  generateMesh() {
    const texture = new THREE.Data3DTexture(
      this.voxelData,
      this.width,
      this.height,
      this.depth
    )
    texture.format = THREE.RedFormat
    texture.unpackAlignment = 1
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const material = voxelMaterial.clone()
    material.uniforms = {
      vData: { value: texture },
      chunkWidth: { value: this.width },
      chunkHeight: { value: this.height },
      chunkDepth: { value: this.depth },
      MAX_STEPS: { value: 64 },
      STEP_SIZE: { value: 0.5 },
      time: { value: 0 }
    }

    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }
}
