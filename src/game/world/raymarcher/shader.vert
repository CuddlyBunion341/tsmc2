// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

varying vec3 vOrigin;
varying vec3 vDirection;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vDirection = position - vOrigin;

  gl_Position = projectionMatrix * mvPosition;
}
