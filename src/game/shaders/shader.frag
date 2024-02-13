precision highp int;
precision mediump float;

in float vAo;
in vec3 bPos;
flat in uint blockId;

out vec4 outColor;

void main() {
  // float ao = vAo / 100.0;
  // vec3 rgb = vec3(ao);
  // vec3 posColor = vec3(bPos / 32.0);
  // outColor = vec4(
  //     mix(posColor.x, rgb.x, 0.5),
  //     mix(posColor.y, rgb.y, 0.5),
  //     mix(posColor.z, rgb.z, 0.5)
  // , 1.0);
  // outColor = vec4(posColor, 1.0);

  if (blockId == 0u) outColor = vec4(1.0, 1.0, 1.0, 1.0);
  else if (blockId == 1u) outColor = vec4(1.0, 0.0, 0.0, 1.0);
  else if (blockId == 2u) outColor = vec4(0.0, 1.0, 0.0, 1.0);
  else if (blockId == 3u) outColor = vec4(0.0, 0.0, 1.0, 1.0);
  else outColor = vec4(1.0,1.0,0.0,1.0);
}
