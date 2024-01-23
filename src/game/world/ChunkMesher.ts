import * as THREE from 'three'
import { voxelMaterial } from './raymarcher/voxelMaterial'
import { JumpMap } from './raymarcher/JumpMap'
import { StupidJumpMap } from './raymarcher/StupidJumpMap'

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
    const jumpMap = new StupidJumpMap(this.width, this.height, this.depth, this.voxelData)
    const jumpBuffer = jumpMap.generate()

    return {
      chunkMap: { value: this.generateDataTexture(this.voxelData) },
      jumpMap: { value: this.generateDataTexture(jumpBuffer) },
      brick: { value: this.generateBrickTexture() },
      chunkSize: { value: 32 },
      voxelStepCount: { value: 16 }
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

  generateDataTexture(data: Int8Array | Uint8Array) {
    const texture = new THREE.Data3DTexture(data, this.width, this.height, this.depth)

    texture.format = THREE.RedFormat
    texture.unpackAlignment = 1
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    return texture
  }
}
