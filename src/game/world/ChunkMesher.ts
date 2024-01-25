import * as THREE from 'three'
import { voxelMaterial } from './raymarcher/voxelMaterial'
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

    const blockTexturePath = '/assets/textures/brick.png'

    const commonUniforms = {
      chunkSize: { value: 32 },
      voxelStepCount: { value: 16 },
      jumpPrecision: { value: 0.75 }
    }

    return {
      ...commonUniforms,
      voxelAndJumpMap: {
        value: this.generateInterlaced3dTexture(this.voxelData, jumpBuffer)
      },
      blockTexture: { value: this.generateBlockTexture(blockTexturePath) }
    }
  }

  interlaceBuffer(buffer1: Uint8Array, buffer2: Uint8Array) {
    // Use array over typed array because it is faster to write to
    const stride = 2

    const newArray = new Array(buffer1.byteLength + buffer2.byteLength)

    for (let i = 0; i < buffer1.byteLength; i++) {
      newArray[i * stride] = buffer1[i]
    }

    for (let i = 0; i < buffer2.byteLength; i++) {
      newArray[i * stride + 1] = buffer2[i]
    }

    const newTypedArray = new Uint8Array(newArray)

    return newTypedArray
  }

  generateInterlaced3dTexture(redChannel: Uint8Array, greenChannel: Uint8Array) {
    const interlacedBuffer = this.interlaceBuffer(redChannel, greenChannel)
    const texture = new THREE.Data3DTexture(
      interlacedBuffer,
      this.width,
      this.height,
      this.depth
    )

    texture.format = THREE.RGFormat
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    return texture
  }

  generateBlockTexture(texturePath: string) {
    const loader = new THREE.TextureLoader()
    const texture = loader.load(texturePath)

    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }
}
