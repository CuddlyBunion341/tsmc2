import * as THREE from 'three'

export type Vertex = {
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
}

export class ChunkMesher {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly arrayBuffer: ArrayBuffer
  ) {}

  generateGeometry() {
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
      'voxel',
      new THREE.BufferAttribute(new Float32Array(this.arrayBuffer), 1)
    )

    return geometry
  }
}
