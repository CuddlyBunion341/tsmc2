export type Point2d = { x: number; y: number }

export class SpiralHelper2d {
  public directionIndex: number
  public positions: Point2d[]
  public radius: number

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
  }

  generateSpiral() {
    let { x, y } = this.origin
    let stepSize = 1

    while (this.radius < this.maxRadius) {
      console.log({ stepSize, x, y, i: this.directionIndex, m5: this.directionIndex % 5 })
      for (let i = 0; i < stepSize; i++) {
        this.positions.push({ x, y })
        x += SpiralHelper2d.directions[this.directionIndex % 4].x
        y += SpiralHelper2d.directions[this.directionIndex % 4].y
      }

      this.directionIndex++

      if (this.directionIndex % 5 === 0) {
        this.radius++
      }

      if (this.directionIndex % 2 === 0) {
        stepSize++
      }
    }

    return this.positions
  }
}
