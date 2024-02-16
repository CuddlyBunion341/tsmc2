import * as THREE from 'three'

export class WaterMaterial {
  material: THREE.RawShaderMaterial

  public static createBasicMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.5, transparent: true, side: THREE.DoubleSide })
  }

  constructor() {
    this.material = this.createMaterial()
  }

  updateUniforms(time: number, uDepth: THREE.Texture) {
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uDepthTexture.value = uDepth
  }
  private createMaterial() {
    const material = new THREE.RawShaderMaterial({
      vertexShader: /*glsl*/`
precision mediump float;

// Vertex positions in object space
in vec3 position;

// Normal vectors in object space, for lighting calculations
in vec3 normal;

// UV coordinates for the vertex, useful for texture mapping
in vec2 uv;

// Outputs to the Fragment Shader
out vec2 vUv;
out vec3 vPosition;
out vec3 vNormal;
out vec4 fPosition;

// Transformation matrices
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
    // Pass the UV to the Fragment Shader
    vUv = uv;

    // Transform the position and normal to camera space
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);

    // Output the final vertex position
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);

    fPosition = gl_Position;
}
      `,
      fragmentShader: /*glsl*/`
precision mediump float;

// Inputs from the Vertex Shader
in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;
in vec4 fPosition;

// Output color of the pixel
out vec4 fragColor;

// Uniforms
uniform sampler2D uDepthTexture; // The depth texture
uniform float uTime;
uniform vec3 uFoamColor;
uniform vec3 uWaterColor;
uniform mat4 uInverseProjectionMatrix; // To unproject depth values
uniform vec2 uScreenSize; // Size of the depth texture / screen

void main() {
  float depth = gl_FragCoord.z;
  vec3 rgb = vec3(depth / 5.0);
  fragColor = vec4(rgb, 0.5);
}
      `,
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
      }
    })

    return material
  }
}
