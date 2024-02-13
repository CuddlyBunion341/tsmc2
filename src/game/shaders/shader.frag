precision highp int;
precision mediump float;

in float vAo;

out vec4 outColor;

void main() {
  outColor = vec4(vAo, vAo, vAo, 1.0);
}
