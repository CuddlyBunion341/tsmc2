import * as THREE from 'three'
import vertexShader from './WaterShader.vert'
import fragmentShader from './WaterShader.frag'

export type WaterMaterialUniforms = {
  uTime: { value: number }
  uFoamThreshold: { value: number }
  uFoamColor: { value: THREE.Color }
  uWaterColor: { value: THREE.Color }
  uDepthTexture: { value: THREE.Texture | null }
}

export class WaterMaterial {
  material: THREE.Material

  constructor() {
    this.material = this.createMaterial()
  }

  public set uniforms(uniforms: WaterMaterialUniforms) {
    // this.material.uniforms = uniforms
  }

  private createMaterial() {
    const material = new THREE.RawShaderMaterial({
      vertexShader, 
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL3,
      extensions: {
        fragDepth: true
      },
      uniforms: {
        uTime: { value: 0 },
        uFoamThreshold: { value: 0.1 },
        uFoamColor: { value: new THREE.Color(0xffffff) },
        uWaterColor: { value: new THREE.Color(0x0000ff) },
        uDepthTexture: { value: null },
        uCameraPosition: { value: new THREE.Vector3() }
      }
    })

    return material
  }
}
