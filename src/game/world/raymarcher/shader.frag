// Inspired by:
// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

precision highp float;
precision highp sampler3D;

varying vec3 vOrigin;
varying vec3 vDirection;

uniform sampler2D blockTexture;
uniform sampler3D voxelAndJumpMap;

uniform float chunkSize;
uniform float voxelStepCount;
uniform float jumpPrecision;

vec2 calculateHitBox(vec3 orig, vec3 dir) {
  const vec3 box_min = vec3(-0.5);
  const vec3 box_max = vec3(0.5);
  vec3 inv_dir = 1.0 / dir;
  vec3 tmin_tmp = (box_min - orig) * inv_dir;
  vec3 tmax_tmp = (box_max - orig) * inv_dir;
  vec3 tmin = min(tmin_tmp, tmax_tmp);
  vec3 tmax = max(tmin_tmp, tmax_tmp);
  float t0 = max(tmin.x, max(tmin.y, tmin.z));
  float t1 = min(tmax.x, min(tmax.y, tmax.z));
  return vec2(t0, t1);
}

#define epsilon .0001

float sampleBlock(vec3 coord) {
  return textureCube(voxelAndJumpMap, coord).r;
}

vec3 calculateNormal(vec3 coord) {

  coord = fract(coord);

  if(coord.x < epsilon)
    return vec3(1.0, 0.0, 0.0);
  if(coord.y < epsilon)
    return vec3(0.0, 1.0, 0.0);
  if(coord.z < epsilon)
    return vec3(0.0, 0.0, 1.0);
  if(coord.x > 1.0 - epsilon)
    return vec3(-1.0, 0.0, 0.0);
  if(coord.y > 1.0 - epsilon)
    return vec3(0.0, -1.0, 0.0);
  if(coord.z > 1.0 - epsilon)
    return vec3(0.0, 0.0, -1.0);

  float step = 1.0 / (chunkSize * voxelStepCount);
  float x = sampleBlock(coord + vec3(-step, 0.0, 0.0)) - sampleBlock(coord + vec3(step, 0.0, 0.0));
  float y = sampleBlock(coord + vec3(0.0, -step, 0.0)) - sampleBlock(coord + vec3(0.0, step, 0.0));
  float z = sampleBlock(coord + vec3(0.0, 0.0, -step)) - sampleBlock(coord + vec3(0.0, 0.0, step));

  return vec3(x, y, z);
}

vec2 calculateUv(vec3 pos) {

  vec3 n = calculateNormal(pos);

  vec2 uv = vec2(0.0);

  // TODO: refactor to step functions

  if(n.x > 0.0) {
    uv = vec2(pos.z, pos.y);
  } else if(n.x < 0.0) {
    uv = vec2(pos.z, pos.y);
  } else if(n.y > 0.0) {
    uv = vec2(pos.x, pos.z);
  } else if(n.y < 0.0) {
    uv = vec2(pos.x, pos.z);
  } else if(n.z > 0.0) {
    uv = vec2(pos.x, pos.y);
  } else if(n.z < 0.0) {
    uv = vec2(pos.x, pos.y);
  }

  return uv * chunkSize;
}

void renderBlockFragment(vec3 position) {
  vec2 uv = calculateUv(position + 0.5);
  vec3 textureColor = texture2D(blockTexture, uv).rgb;
  vec3 normalColor = calculateNormal(position + 0.5) * 0.5 + 0.5;

  vec3 mixedColor = mix(textureColor, normalColor, 0.2);
  gl_FragColor = vec4(mixedColor, 1.0);
}

void main() {
  vec3 rayDirection = normalize(vDirection);
  vec2 bounds = calculateHitBox(vOrigin, rayDirection);

  bounds.x = max(bounds.x, 0.0);

  if(bounds.x > bounds.y)
    discard;

  vec3 rayPosition = vOrigin + bounds.x * rayDirection;
  vec3 inc = 1.0 / abs(rayDirection);
  float smallStep = min(inc.x, min(inc.y, inc.z));
  smallStep /= chunkSize * voxelStepCount;

  gl_FragColor = vec4(0.0);

  float t = bounds.x;

  float stepsTaken = 0.0;
  // use float to avoid casting (this approach aids with debugging)

  while(t < bounds.y) {
    vec2 blockAndJump = textureCube(voxelAndJumpMap, rayPosition + 0.5).rg;
    float blockId = blockAndJump.r;
    float maxJump = blockAndJump.g * 255.0;

    if(blockId > 0.0) {
      renderBlockFragment(rayPosition);
      return;
    }

    float minSafeDistance = smallStep;

    if (maxJump > 1.0) {
      // TODO: refactor into step function, as branching is expensive
      minSafeDistance += smallStep * voxelStepCount * (maxJump - jumpPrecision); 
    }

    rayPosition += rayDirection * minSafeDistance;

    stepsTaken++;

    t += minSafeDistance;
  }
}

