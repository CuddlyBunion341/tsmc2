import { Area, GreedyMesher2d } from './GreedyMesher2d'

type BlockFace = {
  blockId: number
  // TODO: store ao values for each vertex
}

const axes = ['x', 'y', 'z'] as const
type Axis = (typeof axes)[number]

export class GreedyChunkMesher {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly voxelGetter: (x: number, y: number, z: number) => number
  ) {}

  public generateChunkAreas() {
    const areas: Area<BlockFace>[] = []

    const dimensions = { x: this.width, y: this.height, z: this.depth }

    const mesherConfiguration = this.getMesherConfiguration()
    axes.forEach((axis) => {
      const { planeWidth, planeHeight, mapper } = mesherConfiguration[axis]
      for (let layer = 0; layer < dimensions[axis]; layer++) {
        const greedyMesher = new GreedyMesher2d<BlockFace>(
          planeWidth,
          planeHeight,
          (planeX: number, planeY: number) => {
            const cords = mapper(layer, planeX, planeY)
            return this.faceGetter(cords.x, cords.y, cords.z)
          }
        )

        const ares = greedyMesher.call()
        // TODO: implement
      }
    })
  }

  public faceGetter(x: number, y: number, z: number) {
    const blockId = this.voxelGetter(x, y, z) || 0

    return { blockId }
  }

  public getMesherConfiguration() {
    const createCordMapper = (order: Axis[]) => {
      const [a, b, c] = order

      return (layer: number, planeX: number, planeY: number) => {
        const cords = { x: 0, y: 0, z: 0 }
        cords[a] = layer
        cords[b] = planeX
        cords[c] = planeY

        return cords
      }
    }

    return {
      x: {
        planeWidth: this.depth,
        planeHeight: this.height,
        mapper: createCordMapper(['x', 'z', 'y'])
      },
      y: {
        planeWidth: this.width,
        planeHeight: this.depth,
        mapper: createCordMapper(['y', 'x', 'z'])
      },
      z: {
        planeWidth: this.width,
        planeHeight: this.height,
        mapper: createCordMapper(['z', 'x', 'y'])
      }
    }
  }
}
