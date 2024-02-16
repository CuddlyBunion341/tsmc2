import * as THREE from 'three'

export class RenderTarget {
  instance: THREE.WebGLRenderTarget

  constructor() {
    this.instance = new THREE.WebGLRenderTarget(1, 1)
    this.instance.texture.minFilter = THREE.NearestFilter
    this.instance.texture.magFilter = THREE.NearestFilter
    this.instance.depthTexture = new THREE.DepthTexture(1,1)
    this.instance.depthTexture.type = THREE.UnsignedIntType
  }

  updateSize(width: number, height: number) {
    this.instance.setSize(width, height)
  }
}