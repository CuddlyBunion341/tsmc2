export type Point2d = { x: number; y: number }

export class SpiralHelper2d {
  public static directions = [
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 }
  ]

  private directionIndex: number
  private positions: Point2d[]
  private radius: number
  private stepSize: number

  constructor(
    public maxRadius: number,
    public origin: Point2d = { x: 0, y: 0 }
  ) {
    this.directionIndex = 0
    this.positions = []
    this.radius = 0
    this.stepSize = 1
  }

  public generateSpiral() {
    if (this.maxRadius < 1) return [this.origin]

    let { x, y } = this.origin

    while (this.radius < this.maxRadius || this.directionIndex === 0) {
      for (let i = 0; i < this.stepSize; i++) {
        this.positions.push({ x, y })
        x += SpiralHelper2d.directions[this.directionIndex].x
        y += SpiralHelper2d.directions[this.directionIndex].y
      }

      this.directionIndex++
      this.directionIndex %= 4

      if (this.directionIndex % 2 === 0) this.stepSize++
      if (this.directionIndex % 4 === 0) this.radius++
    }

    return this.positions
  }
}
