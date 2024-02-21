import * as THREE from 'three'
import { ChunkData } from "../data/ChunkData"

export type Vertex = {
  position: [number, number, number]
  normal: [number, number, number]
  uv: [number, number]
  color: [number, number, number]
}

export abstract class AbstractChunkMesher {
  static geometryAttributes = [
    { name: 'position', size: 3 },
    { name: 'normal', size: 3 },
    { name: 'uv', size: 2 },
    { name: 'color', size: 3 }
  ] as const

  static vertexData: Vertex[] = [
    // left
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [-1, 0, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [-1, 0, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [-1, 0, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [-1, 0, 0], uv: [1, 1] },
    // right
    { color: [0, 0, 0], position: [1, -1, 1], normal: [1, 0, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [1, -1, -1], normal: [1, 0, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [1, 0, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [1, 1, -1], normal: [1, 0, 0], uv: [1, 1] },
    // bottom
    { color: [0, 0, 0], position: [1, -1, 1], normal: [0, -1, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [0, -1, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, -1, -1], normal: [0, -1, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [0, -1, 0], uv: [1, 1] },
    // top
    { color: [0, 0, 0], position: [1, 1, -1], normal: [0, 1, 0], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 1, 0], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [0, 1, 0], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 1, 0], uv: [1, 1] },
    // back
    { color: [0, 0, 0], position: [1, -1, -1], normal: [0, 0, -1], uv: [0, 0] },
    { color: [0, 0, 0], position: [-1, -1, -1], normal: [0, 0, -1], uv: [1, 0] },
    { color: [0, 0, 0], position: [1, 1, -1], normal: [0, 0, -1], uv: [0, 1] },
    { color: [0, 0, 0], position: [-1, 1, -1], normal: [0, 0, -1], uv: [1, 1] },
    // front
    { color: [0, 0, 0], position: [-1, -1, 1], normal: [0, 0, 1], uv: [0, 0] },
    { color: [0, 0, 0], position: [1, -1, 1], normal: [0, 0, 1], uv: [1, 0] },
    { color: [0, 0, 0], position: [-1, 1, 1], normal: [0, 0, 1], uv: [0, 1] },
    { color: [0, 0, 0], position: [1, 1, 1], normal: [0, 0, 1], uv: [1, 1] }
  ] as const

  static vertexIndices = [0, 1, 2, 2, 1, 3] as const

  static cubeFaceCount = 6
  static faceVertexCount = 4

  constructor(
    public readonly dimensions: THREE.Vector3,
    public readonly chunkData: ChunkData
  ) { }
}
