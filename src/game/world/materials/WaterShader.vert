precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 uv;

out vec2 vUv;
out vec3 vPosition;
out vec3 vNormal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
  vUv = uv;

  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);

  vPosition -= vNormal * 0.3;

  gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}
