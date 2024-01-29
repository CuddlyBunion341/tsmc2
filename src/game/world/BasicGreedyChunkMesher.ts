import * as THREE from 'three'
import { Vertex } from './ChunkMesher'

export class BasicGreedyChunkMesher {
  constructor(
    public width: number,
    public height: number,
    public getter: (x: number, y: number, z: number) => number
  ) {}

  public generateGeometry() {}

  public reduceVertices(vertices: Vertex[]) {
    const dataList: {
      position: number[]
      normal: number[]
      uv: number[]
    } = { position: [], normal: [], uv: [] }

    return vertices.reduce((prev, vertex) => {
      prev.position.push(...vertex.position)
      prev.normal.push(...vertex.normal)
      prev.uv.push(...vertex.uv)

      return prev
    }, dataList)
  }

  public generateGeometryFromVertices(vertices: Vertex[]) {
    const geometry = new THREE.BufferGeometry()

    const attributes = [
      { name: 'position', size: 3 },
      { name: 'normal', size: 3 },
      { name: 'uv', size: 2 }
    ] as const

    const reducedVertices = this.reduceVertices(vertices)

    attributes.forEach((attribute) => {
      const { name, size } = attribute
      geometry.setAttribute(
        name,
        new THREE.BufferAttribute(new Float32Array(reducedVertices[name]), size)
      )
    })

    return geometry
  }

  public generateMesh() {}
}
