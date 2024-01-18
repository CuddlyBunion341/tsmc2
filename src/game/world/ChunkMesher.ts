import * as THREE from 'three'
import { voxelMaterial } from './raytracer/voxelMaterial'

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

    // const material = voxelMaterial.clone()
    // material.uniforms = {
    //   uData: { value: texture }
    // }

    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    )

    return mesh
  }
}
