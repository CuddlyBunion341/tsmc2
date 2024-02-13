import * as THREE from "three"
import vertexShader from "../shaders/shader.vert"
import fragmentShader from "../shaders/shader.frag"

export class ChunkMaterial {
  private static material: THREE.ShaderMaterial

  private static uniforms = {}

  private static createMaterial() {
    return new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      glslVersion: THREE.GLSL3,
      side: THREE.DoubleSide, // TODO: remove once normals are implemented
    })
  }

  public static getMaterial() {
    if (!this.material) this.material = this.createMaterial()
    return this.material
  }
}
