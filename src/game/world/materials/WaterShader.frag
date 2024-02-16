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
  fragColor = vec4(rgb, 0.6);
}
