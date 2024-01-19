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
    public readonly bufferView: DataView
  ) {}

  generateMesh() {
    const texture = new THREE.Data3DTexture(
      this.bufferView,
      this.width,
      this.height,
      this.depth
    )
    texture.needsUpdate = true

    const size = 16
    // const buffer = new Float32Array(size * size)
    // const view = new DataView(buffer)

    const array = new Array(size * size)

    {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          array[x * size + y] = Math.random() * 120
        }
      }
    }

    // const texture2d = new THREE.DataTexture(buffer, size, size, THREE.RedFormat)
    const texture2d = new THREE.DataTexture(
      new Uint8Array(array),
      size,
      size,
      THREE.RedFormat
    )
    console.log(texture2d.image)
    texture2d.needsUpdate = true

    // const material = new THREE.MeshBasicMaterial()

    const material = voxelMaterial.clone()
    material.uniforms = {
      uData: { value: texture },
      vData: { value: texture2d },
      chunkWidth: { value: this.width },
      chunkHeight: { value: this.height },
      chunkDepth: { value: this.depth },
      MAX_STEPS: { value: 64 },
      STEP_SIZE: { value: 0.5 }
    }

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    )

    return mesh
  }
}
