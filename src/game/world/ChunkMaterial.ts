import * as THREE from "three"

export class ChunkMaterial {
  private static material: THREE.ShaderMaterial

  private static uniforms = {time: {value: 0.0}}

  private static createMaterial() {
      return new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
          }
        `,
        fragmentShader: `
        varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(vUv, 1.0, 1.0);
          }
        `
      })
  }

  private static updateUniforms() {
    this.uniforms.time.value = performance.now() / 1000
    this.material.needsUpdate = true
    requestAnimationFrame(() => this.updateUniforms())
  }

  public static getMaterial() {
    if (!this.material) this.material = this.createMaterial()
    this.updateUniforms()

    return this.material
  }
}
