import { Matrix2d } from '../util/Matrix2d'

export interface Area<T> {
  value: T
  x: number
  y: number
  w: number
  h: number
  canGrowX: boolean
  canGrowY: boolean
}

export class GreedyMesher2D<T> {
  private areas: Area<T>[]
  private currentArea: Area<T>
  private processedList: Matrix2d<boolean>

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly dataGetter: (x: number, y: number, z: number) => T
  ) {
    this.areas = []
    this.processedList = new Matrix2d(width, height)
  }

  call() {
    // TODO: implement
  }

  step() {
    // TODO: implement
  }

  private growX() {
    // TODO: implement
  }

  private growY() {
    // TODO: implement
  }

  private setNewArea() {
    // TODO: implement
  }
}
