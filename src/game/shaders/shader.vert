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
out vec3 bPos;
out vec3 vNormal;
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

const uint AO_SIZE = 3u;
const uint AO_MASK = 58720256u;
const uint AO_SHIFT = (POS_X_SIZE + POS_Y_SIZE + POS_Z_SIZE);

const uint VERTEX_INDEX_MASK = 16777215u;
const uint VERTEX_INDEX_SHIFT = (POS_X_SIZE + POS_Y_SIZE + POS_Z_SIZE + AO_SIZE);

struct Vertex {
  vec3 position;
  vec3 normal;
  vec2 uv;
};

const Vertex[24] vertices = Vertex[24]( 
    // left
Vertex(vec3(-1, -1, -1), vec3(-1, 0, 0), vec2(0, 0)), Vertex(vec3(-1, -1, 1), vec3(-1, 0, 0), vec2(1, 0)), Vertex(vec3(-1, 1, -1), vec3(-1, 0, 0), vec2(0, 1)), Vertex(vec3(-1, 1, 1), vec3(-1, 0, 0), vec2(1, 1)),
    // right
Vertex(vec3(1, -1, 1), vec3(1, 0, 0), vec2(0, 0)), Vertex(vec3(1, -1, -1), vec3(1, 0, 0), vec2(1, 0)), Vertex(vec3(1, 1, 1), vec3(1, 0, 0), vec2(0, 1)), Vertex(vec3(1, 1, -1), vec3(1, 0, 0), vec2(1, 1)),
    // bottom
Vertex(vec3(1, -1, 1), vec3(0, -1, 0), vec2(0, 0)), Vertex(vec3(-1, -1, 1), vec3(0, -1, 0), vec2(1, 0)), Vertex(vec3(1, -1, -1), vec3(0, -1, 0), vec2(0, 1)), Vertex(vec3(-1, -1, -1), vec3(0, -1, 0), vec2(1, 1)),
    // top
Vertex(vec3(1, 1, -1), vec3(0, 1, 0), vec2(0, 0)), Vertex(vec3(-1, 1, -1), vec3(0, 1, 0), vec2(1, 0)), Vertex(vec3(1, 1, 1), vec3(0, 1, 0), vec2(0, 1)), Vertex(vec3(-1, 1, 1), vec3(0, 1, 0), vec2(1, 1)),
    // back
Vertex(vec3(1, -1, -1), vec3(0, 0, -1), vec2(0, 0)), Vertex(vec3(-1, -1, -1), vec3(0, 0, -1), vec2(1, 0)), Vertex(vec3(1, 1, -1), vec3(0, 0, -1), vec2(0, 1)), Vertex(vec3(-1, 1, -1), vec3(0, 0, -1), vec2(1, 1)),
    // front
Vertex(vec3(-1, -1, 1), vec3(0, 0, 1), vec2(0, 0)), Vertex(vec3(1, -1, 1), vec3(0, 0, 1), vec2(1, 0)), Vertex(vec3(-1, 1, 1), vec3(0, 0, 1), vec2(0, 1)), Vertex(vec3(1, 1, 1), vec3(0, 0, 1), vec2(1, 1)));

void main() {
  float posX = float((data & POS_X_MASK) >> POS_X_SHIFT);
  float posY = float((data & POS_Y_MASK) >> POS_Y_SHIFT);
  float posZ = float((data & POS_Z_MASK) >> POS_Z_SHIFT);
  bPos = vec3(posX, posY, posZ);
  vAo = float((data & AO_MASK) >> AO_SHIFT) / 8.0;
  blockId = data >> 24u;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(bPos, 1.0);
}
