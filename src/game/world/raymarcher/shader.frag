uniform int chunkWidth;
uniform int chunkHeight;
uniform int chunkDepth;
uniform samplerCube uData;

uniform float THRESHOLD;
uniform float STEP_SIZE;
uniform int MAX_STEPS;

varying vec3 v_position;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  gl_FragColor = vec4(0.5,0.5,0.5,0.01);

  vec3 rayOrigin = cameraPosition;
  vec3 rayDirection = normalize(v_position - rayOrigin);

  vec3 currentPos = rayOrigin;
  bool hit = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    int blockId = int(textureCube(uData, currentPos));

    if (blockId != 0) {
      hit = true;
      break;
    }

    currentPos += rayDirection * STEP_SIZE;
  }

  if (hit) {
    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
  } else {
    gl_FragColor = vec4(1.0,1.0,0.5,1.0);
  }
}
