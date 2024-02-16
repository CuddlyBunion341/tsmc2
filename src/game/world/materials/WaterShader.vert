precision mediump float;

// Vertex positions in object space
in vec3 position;

// Normal vectors in object space, for lighting calculations
in vec3 normal;

// UV coordinates for the vertex, useful for texture mapping
in vec2 uv;

// Outputs to the Fragment Shader
out vec2 vUv;
out vec3 vPosition;
out vec3 vNormal;
out vec4 fPosition;

// Transformation matrices
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
    // Pass the UV to the Fragment Shader
  vUv = uv;

    // Transform the position and normal to camera space
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);

  vPosition -= vNormal * 0.3;

    // Output the final vertex position
  gl_Position = projectionMatrix * vec4(vPosition, 1.0);

  fPosition = gl_Position;
}
