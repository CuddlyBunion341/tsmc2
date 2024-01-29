export type Point2d = { x: number; y: number }

export class SpiralHelper2d {
  public directionIndex: number
  public positions: Point2d[]

  public static directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ]

  constructor(
    public radius: number,
    public origin: Point2d = { x: 0, y: 0 }
  ) {
    this.directionIndex = 0
    this.positions = []
  }

  generateSpiral() {
    let { x, y } = this.origin

    // TODO: implement

    return this.positions
  }
}
