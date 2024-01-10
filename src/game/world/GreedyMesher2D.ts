export type Area = {
  value: number
  x: number
  y: number
  w: number
  h: number
  canGrowX: boolean
  canGrowY: boolean
}

export class GreedyMesher2D {
  private areas: Area[]
  private currentArea: Area

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly dataGetter: (x: number, y: number, z: number) => number
  ) {
    this.areas = []
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
