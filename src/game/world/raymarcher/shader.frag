// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

varying vec2 v_uv;
// uniform sampler2D uData;
uniform highp sampler3D vData;

void main() {
  // float color = texture2D(uData, v_uv).r;
  // float color = textureCube(vData, vec3(v_uv, 1.0)).r;
  // float color = textureCube(vData, vec3(v_uv,0.0)).r;
  // float color = texture(vData, vec3(v_uv,0.0)).r;
  float color = texture(vData, vec3(v_uv,1.0)).r;
  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}
