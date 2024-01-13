varying vec3 v_normal;
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  v_normal = mat3(normalMatrix) * normal;
}
