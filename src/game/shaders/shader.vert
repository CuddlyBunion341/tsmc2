precision highp int;
precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

in uint data;

out vec2 vUv;
out vec3 vPos;
out float ao;
flat out uint blockId;

void main() {
  // Data partition:
  // posX: bit 0-4
  // posY: bit 5-9
  // posZ: bit 10-14
  // blockId: bit 15-22
  // ao: bit 23-25

  float posX = float(data & 0x1F);
  float posY = float((data >> 5) & 0x1F);
  float posZ = float((data >> 10) & 0x1F);
  vPos = vec3(posX, posY, posZ);
  blockId = data >> 15;
  ao = float((data >> 23) & 0x7);

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}
