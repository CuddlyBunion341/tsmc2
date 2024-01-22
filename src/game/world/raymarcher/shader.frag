// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

precision highp float;
precision highp sampler3D;

varying vec3 vOrigin;
varying vec3 vDirection;

uniform sampler3D map;
uniform sampler3D jumpMap;
uniform sampler2D brick;

uniform float threshold;
uniform float chunkSize;
uniform float voxelStepCount;

vec2 hitBox(vec3 orig, vec3 dir) {
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

float sampleBlock(vec3 position) {
  return texture(map, vec3(position.x, position.y, position.z)).r;
}

float sampleJumpMap(vec3 position) {
  return texture(jumpMap, vec3(position.x, position.y, position.z)).r;
}

#define epsilon .0001

vec3 normal(vec3 coord) {

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

  float step = 0.002;
  float x = sampleBlock(coord + vec3(-step, 0.0, 0.0)) - sampleBlock(coord + vec3(step, 0.0, 0.0));
  float y = sampleBlock(coord + vec3(0.0, -step, 0.0)) - sampleBlock(coord + vec3(0.0, step, 0.0));
  float z = sampleBlock(coord + vec3(0.0, 0.0, -step)) - sampleBlock(coord + vec3(0.0, 0.0, step));

  return vec3(x, y, z);
}

vec2 calculateUv(vec3 pos) {

  vec3 n = normal(pos);

  vec2 uv = vec2(0.0);

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

void main() {

  vec3 rayDir = normalize(vDirection);
  vec2 bounds = hitBox(vOrigin, rayDir);

  if(bounds.x > bounds.y)
    discard;

  bounds.x = max(bounds.x, 0.0);

  vec3 p = vOrigin + bounds.x * rayDir;
  vec3 inc = 1.0 / abs(rayDir);
  float delta = min(inc.x, min(inc.y, inc.z));

  delta /= chunkSize * voxelStepCount;

  float smallStep = delta;

  gl_FragColor = vec4(0.0);

  float t = bounds.x;

  while(t < bounds.y) {
    float blockId = sampleBlock(p + 0.5);

    if(blockId > 0.0) {

      vec2 uv = calculateUv(p + 0.5);
      // vec3 textureColor = texture2D(brick, vec2(uv)).rgb;
      vec3 normalColor = normal(p + 0.5) * 0.5 + 0.5;

      // gl_FragColor.rgb = mix(textureColor, normalColor, 0.1);
      gl_FragColor.rgb = normalColor;

      gl_FragColor.a = 1.;

      break;
    }

    float minSafeDistance = delta;

    if (sampleJumpMap(p + .5) != 0.0) {
      minSafeDistance += smallStep * voxelStepCount;
      // gl_FragColor = vec4(1.0);
      // return;
    }

    // float maxJump = sampleJumpMap(p + .5) * 1 / voxelStepCount;
    // if (maxJump > 0.0) {
    //   minSafeDistance = min(minSafeDistance, maxJump);
    // }

    // float msd = sampleJumpMap(p + .5);
    // if (msd > .9 && msd < 1.1) { 
    //   gl_FragColor = vec4(1.0);
    //   return;
    // }
    


    // p += rayDir * max(delta, minSafeDistance);

    p += rayDir * minSafeDistance;

    t += minSafeDistance;
  }

  if(gl_FragColor.a == 0.0)
    discard;
}
