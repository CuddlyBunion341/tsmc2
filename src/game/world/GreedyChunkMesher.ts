import { ChunkMesher, FACE_COUNT, Vertex } from './ChunkMesher'
import { Area, GreedyMesher2d } from './GreedyMesher2d'

type BlockFace = {
  blockId: number
  // TODO: store ao values for each vertex
}

const FACE_DIRECTIONS = ['+x', '-x', '+y', '-y', '+z', '-z'] as const
type FACE_DIRECTION = (typeof FACE_DIRECTIONS)[number]

type GreedyMesherParam = {
  width: 'width' | 'height' | 'width'
  height: 'height' | 'depth' | 'height'
  x: 'x' | 'y' | 'z'
  y: 'y' | 'z' | 'x'
}

const GREEDY_MESHER_PARAMS: Record<FACE_DIRECTION, GreedyMesherParam> = {
  '+x': {
    width: 'height',
    height: 'depth',
    x: 'y',
    y: 'z'
  },
  '-x': {
    width: 'height',
    height: 'depth',
    x: 'y',
    y: 'z'
  },
  '+y': {
    width: 'width',
    height: 'depth',
    x: 'x',
    y: 'z'
  },
  '-y': {
    width: 'width',
    height: 'depth',
    x: 'x',
    y: 'z'
  },
  '+z': {
    width: 'width',
    height: 'height',
    x: 'x',
    y: 'y'
  },
  '-z': {
    width: 'width',
    height: 'height',
    x: 'x',
    y: 'y'
  }
} as const

export class GreedyChunkMesher {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number,
    public readonly blockGetter: (x: number, y: number, z: number) => number
  ) {}

  public generateChunkAreas() {
    const areas: Area<BlockFace>[] = []

    for (let n = 0; n < FACE_DIRECTIONS.length; n++) {
      const params = GREEDY_MESHER_PARAMS[FACE_DIRECTIONS[n]]

      const mesher = new GreedyMesher2d<BlockFace>(
        this[params.width],
        this[params.height],
        (x: number, y: number) => {
          const blockId = this.blockGetter(
            params.x === 'x' ? x : params.y === 'x' ? y : 0,
            params.x === 'y' ? x : params.y === 'y' ? y : 0,
            params.x === 'z' ? x : params.y === 'z' ? y : 0
          )

          // TODO: implement ao, light

          return { blockId }
        },
        (value) => value.blockId === 0,
        (a, b) => {
          return a.blockId === b.blockId
          // TODO: implement && a.ao === b.ao
          // TODO: implement && a.light === b.light
        }
      )

      const faceAreas = mesher.call()

      faceAreas.forEach((area) => {
        const { x, y, w, h } = area
        // TODO: implement
      })
    }

    return areas
  }
}
