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
uniform vec3 uCameraPosition;

void main() {
  float distance = length(vPosition - uCameraPosition);
  float fogFactor = distance / 50.0;
  vec3 fogColor = vec3(0.0,0.0,1.0);
  fragColor = vec4(fogColor, min(fogFactor, 0.8));
}
