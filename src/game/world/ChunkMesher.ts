import * as THREE from 'three'
import { voxelMaterial } from './raymarcher/voxelMaterial'
import { JumpMap } from './raymarcher/JumpMap'

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
    const material = voxelMaterial.clone()
    material.uniforms = this.generateUniforms()

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

  generateUniforms() {
    const voxelTexture = this.generateDataTexture(this.voxelData)
    console.time('jump map')
    const jumpMap = new JumpMap(
      this.width,
      this.height,
      this.depth,
      this.voxelData
    ).generate()
    const jumpMapTexture = this.generateDataTexture(jumpMap)

    return {
      map: { value: voxelTexture },
      jumpMap: { value: jumpMapTexture },
      brick: { value: this.generateBrickTexture() },
      threshold: { value: 0 },
      steps: { value: 32 * 16 }
    }
  }

  generateBrickTexture() {
    const loader = new THREE.TextureLoader()
    const texture = loader.load('/assets/textures/brick.png')

    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }

  generateDataTexture(data: Uint8Array) {
    const texture = new THREE.Data3DTexture(data, this.width, this.height, this.depth)

    texture.format = THREE.RedFormat
    texture.unpackAlignment = 1
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    return texture
  }
}
