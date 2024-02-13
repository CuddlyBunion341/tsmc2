import * as THREE from "three"

export class ChunkMaterial {
  private static material: THREE.ShaderMaterial

  private static uniforms = {time: {value: 0.0}}

  private static createMaterial() {
      return new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          varying uint16 vData;

          void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
            vViewPosition = cameraPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
