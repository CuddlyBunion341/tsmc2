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
out float vAo;
flat out uint blockId;

const uint POS_X_MASK = 31u;
const uint POS_Y_MASK = 992u;
const uint POS_Z_MASK = 31744u;

const uint POS_X_SIZE = 5u;
const uint POS_Y_SIZE = 5u;
const uint POS_Z_SIZE = 5u;

const uint POS_X_SHIFT = 0u;
const uint POS_Y_SHIFT = POS_X_SIZE;
const uint POS_Z_SHIFT = (POS_X_SIZE + POS_Y_SIZE);

const uint AO_MASK = 58720256u;
const uint AO_SHIFT = (POS_X_SIZE + POS_Y_SIZE + POS_Z_SIZE);

void main() {
  float posX = float((data & POS_X_MASK) >> POS_X_SHIFT);
  float posY = float((data & POS_Y_MASK) >> POS_Y_SHIFT);
  float posZ = float((data & POS_Z_MASK) >> POS_Z_SHIFT);
  vPos = vec3(posX, posY, posZ);

  vAo = float((data & AO_MASK) >> AO_SHIFT) / 8.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}
