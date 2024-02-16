precision mediump float;

in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;

out vec4 fragColor;

uniform sampler2D uDepthTexture; 
uniform float uTime;
uniform vec3 uFoamColor;
uniform vec3 uWaterColor;
uniform mat4 uInverseProjectionMatrix; 
uniform vec2 uScreenSize; 

void main() {
  float depth = gl_FragCoord.z;
  vec3 rgb = vec3(depth / 5.0);
  fragColor = vec4(rgb, 0.6);
}
