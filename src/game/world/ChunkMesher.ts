import * as THREE from 'three'
import { voxelMaterial } from './raymarcher/voxelMaterial'
import { GenerateJumpMap } from './raymarcher/JumpMap'

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
    const voxelTexture = this.generateDataTexture(this.voxelData)
    const material = voxelMaterial.clone()
    material.uniforms = {
      map: { value: voxelTexture },
      threshold: { value: 0 },
      steps: { value: 32 * 16 }
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

  generateDataTexture(data: Uint8Array) {
    const texture = new THREE.Data3DTexture(data, this.width, this.height, this.depth)

    texture.format = THREE.RedFormat
    texture.unpackAlignment = 1
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
  }
}
