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
    public readonly arrayBuffer: ArrayBuffer
  ) {}

  generateMesh() {
    const textureSize = Math.sqrt(this.width * this.height * this.depth)
    const texture = new THREE.DataTexture(
      this.arrayBuffer,
      textureSize,
      textureSize,
      THREE.RedFormat,
      THREE.UnsignedByteType
    )
    texture.needsUpdate = true

    // const material = new THREE.MeshBasicMaterial()

    const material = voxelMaterial.clone()
    material.uniforms = {
      uData: { value: texture },
      chunkWidth: { value: this.width },
      chunkHeight: { value: this.height },
      chunkDepth: { value: this.depth },
      maxStepSize: { value: 32 },
      THRESHOLD: { value: 0.0 },
      MAX_STEPS: { value: 10 },
      STEP_SIZE: { value: 0.5 }
    }

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    )

    return mesh
  }
}
