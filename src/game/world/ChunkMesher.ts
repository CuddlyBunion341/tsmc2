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
      map: { value: texture },
      threshold: { value: 0.7 },
      steps: { value: 32 * 32 }
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }
}
