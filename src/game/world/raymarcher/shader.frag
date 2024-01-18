uniform int chunkWidth;
uniform int chunkHeight;
uniform int chunkDepth;
uniform sampler2D uData;

uniform float THRESHOLD;
uniform float STEP_SIZE;
uniform int MAX_STEPS;

varying vec3 v_position;

// uniform vec3 cameraPosition;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  gl_FragColor = vec4(0.5,0.5,0.5,0.01);

  vec3 rayOrigin = cameraPosition;
  // HOW DO I GET THE CAMERA POS?
  vec3 rayDirection = normalize(v_position - rayOrigin);

  vec3 currentPos = rayOrigin;
  bool hit = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    // float voxelValue = texture(voxelTexture, currentPos).r; // Fetch voxel value at current position
    vec2 resolution = vec2(chunkWidth, chunkHeight);
    vec2 uv = gl_FragCoord.xy / resolution;
    float v0 = uv.x;
    float v1 = uv.y;

    float voxelValue = texture2D(uData, vec2(v0, v1)).r; // Fetch voxel value at current position
    if (voxelValue > THRESHOLD) { // Some threshold to define a hit
      hit = true;
      break;
    }

    if (voxelValue != 0.0) {
      // gl_FragColor = vec4(voxelValue, voxelValue, voxelValue, 1.0);
      gl_FragColor = vec4(1.0,0.0,0.0,0.0);
      break;
    }
    currentPos += rayDirection * STEP_SIZE; // Move along the ray
  }

  if (hit) {
    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    // gl_FragColor = vec4(computedColor);
  } else {
    gl_FragColor = vec4(1.0,1.0,0.5,1.0);
  }
}
