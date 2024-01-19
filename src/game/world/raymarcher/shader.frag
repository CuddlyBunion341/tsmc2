// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

varying vec2 v_uv;
uniform highp sampler3D vData;

void main() {
  float color = texture(vData, vec3(v_uv,1.0)).r;
  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}
