import { Matrix2d } from '../util/Matrix2d'

export interface Area<T> {
  value: T
  x: number
  y: number
  w: number
  h: number
  state: 'growingX' | 'growingY' | 'done'
}

export class GreedyMesher2d<T> {
  public areas: Area<T>[]
  public currentArea: Area<T>
  public processed: Matrix2d<boolean>
  public isDone: boolean

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly dataGetter: (x: number, y: number) => T,
    private readonly skip: (value: T) => boolean = (value) => !!value,
    private readonly isSameValue: (a: T, b: T) => boolean = (a, b) => a === b
  ) {
    this.areas = []
    this.currentArea = this.newArea(0, 0)
    this.processed = new Matrix2d(width, height, false)
    this.isDone = false
  }

  public call() {
    while (this.step());

    return this.areas
  }

  public step() {
    if (this.currentArea.state === 'growingX') {
      this.growX()
    }
    if (this.currentArea.state === 'growingY') {
      this.growY()
    }
    if (this.currentArea.state === 'done') {
      this.areas.push(this.currentArea)
      this.updateProcessed()

      const next = this.getNextArea()
      if (next) this.currentArea = next

      this.isDone = next === null
    }

    return !this.isDone
  }

  private newArea(x: number, y: number): Area<T> {
    return { value: this.dataGetter(x, y), x, y, w: 1, h: 1, state: 'growingX' }
  }

  private updateProcessed() {
    for (let x = this.currentArea.x; x < this.currentArea.x + this.currentArea.w; x++) {
      for (let y = this.currentArea.y; y < this.currentArea.y + this.currentArea.h; y++) {
        this.processed.set(x, y, true)
      }
    }
  }

  private getNextArea() {
    const lastArea = this.currentArea

    let initialY = lastArea.y
    let initialX = lastArea.x + lastArea.w

    if (initialX >= this.width) {
      initialX = 0
      initialY++
    }

    for (let y = initialY; y < this.height; y++) {
      for (let x = initialX; x < this.width; x++) {
        if (!this.processed.get(x, y) && !this.skip(this.dataGetter(x, y))) {
          return this.newArea(x, y)
        }
      }
    }

    return null
  }

  private growX() {
    const { x, y, w } = this.currentArea

    if (!this.canGrowInto(x + w, y)) {
      this.currentArea.state = 'growingY'
      return
    }

    this.currentArea.w++
  }

  private growY() {
    const { x, y, w, h } = this.currentArea

    for (let xi = x; xi < x + w; xi++) {
      if (!this.canGrowInto(xi, y + h)) {
        this.currentArea.state = 'done'
        return
      }
    }

    this.currentArea.h++
  }

  private canGrowInto(x: number, y: number) {
    return (
      x < this.width &&
      y < this.height &&
      this.isSameValue(this.dataGetter(x, y), this.currentArea.value) &&
      !this.skip(this.dataGetter(x, y))
    )
  }
}
