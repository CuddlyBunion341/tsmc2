import * as THREE from 'three'

export class WaterMaterial {
  public static createBasicMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.5, transparent: true, side: THREE.DoubleSide })
  }

  public static createMaterial() {
    const material = new THREE.RawShaderMaterial({
      vertexShader: /*glsl*/`
precision mediump int;
precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

in vec3 position;
in vec3 normal;

void main() {
  vec3 vPos = position - vec3(0.0, 0.3, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}

      `,
      fragmentShader: /*glsl*/`
precision highp int;
precision mediump float;

flat in uint blockId;

out vec4 outColor;

void main() {
  outColor = vec4(0.0, 0.0, 1.0, 0.5);
}
      `,
      transparent: true,
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL3
    })

    return material
  }
}
