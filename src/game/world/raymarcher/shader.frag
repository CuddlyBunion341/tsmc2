// https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

precision highp float;
precision highp sampler3D;

varying vec3 vOrigin;
varying vec3 vDirection;

uniform sampler3D map;
uniform sampler3D jumpMap;

uniform float threshold;
uniform float steps;

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

float sample1(vec3 p) {
  return texture(map, vec3(p.x,p.y,p.z)).r;
}

#define epsilon .0001

vec3 normal(vec3 coord) {
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

  float step = 0.01;
  float x = sample1(coord + vec3(-step, 0.0, 0.0)) - sample1(coord + vec3(step, 0.0, 0.0));
  float y = sample1(coord + vec3(0.0, -step, 0.0)) - sample1(coord + vec3(0.0, step, 0.0));
  float z = sample1(coord + vec3(0.0, 0.0, -step)) - sample1(coord + vec3(0.0, 0.0, step));

  return normalize(vec3(x, y, z));
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
  delta /= steps;

  gl_FragColor = vec4(0.0);

  float stepsTaken = 0.0;

  for(float t = bounds.x; t < bounds.y; t += delta) {

    float d = sample1(p + 0.5);

    if(d > threshold) {

      gl_FragColor.a = 1.;

      float color = 10.0 /  stepsTaken;

      gl_FragColor.rgb = vec3(color);
      break;

    }

    p += rayDir * delta;
    stepsTaken++;
  }

  if(gl_FragColor.a == 0.0)
    discard;
}
