export type Point2d = { x: number; y: number }

export class SpiralHelper2d {
  public directionIndex: number
  public positions: Point2d[]
  public radius: number
  public stepSize: number

  public static directions = [
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 }
  ]

  constructor(
    public maxRadius: number,
    public origin: Point2d = { x: 0, y: 0 }
  ) {
    this.directionIndex = 0
    this.positions = []
    this.radius = 0
    this.stepSize = 1
  }

  generateSpiral() {
    let { x, y } = this.origin

    while (this.radius < this.maxRadius) {
      for (let i = 0; i < this.stepSize; i++) {
        this.positions.push({ x, y })
        x += SpiralHelper2d.directions[this.directionIndex % 4].x
        y += SpiralHelper2d.directions[this.directionIndex % 4].y
      }

      this.directionIndex++

      if (this.directionIndex % 2 === 0) this.stepSize++
      if (this.directionIndex % 5 === 0) this.radius++
    }

    return this.positions
  }
}
