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
    console.log(this.voxelData)
    texture.needsUpdate = true

    const size = 16
    // const buffer = new Float32Array(size * size)
    // const view = new DataView(buffer)

    const array = new Array(size * size * size)

    {
      let i = 0

      for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
          for (let z = 0; z < 32; z++) {
            i++
            array[i] = Math.random() * 255
          }
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
      uData: { value: texture2d },
      vData: { value: texture },
      chunkWidth: { value: this.width },
      chunkHeight: { value: this.height },
      chunkDepth: { value: this.depth },
      MAX_STEPS: { value: 64 },
      STEP_SIZE: { value: 0.5 },
      time: { value: 0 }
    }

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    )

    return mesh
  }
}
