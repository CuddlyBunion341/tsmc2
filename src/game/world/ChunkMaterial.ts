import * as THREE from "three"

export class ChunkMaterial {
  private static material: THREE.ShaderMaterial

  private static uniforms = { time: { value: 0.0 } }

  private static createMaterial() {
    return new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /*glsl*/`
        uniform mat4 modelMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat3 normalMatrix;
        uniform vec3 cameraPosition;
        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;

        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition; 
        }
        `,
      fragmentShader: /*glsl*/`
        precision highp float;
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
