varying vec2 v_uv;
uniform sampler2D vData;

void main() {
  float color = texture2D(vData, v_uv).r;
  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}
