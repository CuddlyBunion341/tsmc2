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
  private areas: Area<T>[]
  private currentArea: Area<T>
  private processed: Matrix2d<boolean>
  private isDone: boolean

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly dataGetter: (x: number, y: number) => T
  ) {
    this.areas = []
    this.currentArea = this.newArea(0, 0)
    this.processed = new Matrix2d(width, height)
    this.isDone = false
  }

  public call() {
    while (!this.step());

    return this.areas
  }

  public step() {
    if (this.isDone) return false

    switch (this.currentArea.state) {
      case 'growingX':
        this.growX()
        break
      case 'growingY':
        this.growY()
        break
      case 'done':
        this.updateProcessed()
        this.areas.push(this.currentArea)
        if (!this.setNextArea()) {
          this.isDone = true
          return false
        }
    }

    return true
  }

  setNextArea() {
    const area = this.getNextArea()
    if (!area) return null
    return (this.currentArea = area)
  }

  private newArea(x: number, y: number): Area<T> {
    return {
      value: this.dataGetter(x, y),
      x,
      y,
      w: 1,
      h: 1,
      state: 'growingX'
    }
  }

  private updateProcessed() {
    for (
      let x = this.currentArea.x;
      x < this.currentArea.x + this.currentArea.w;
      x++
    ) {
      for (
        let y = this.currentArea.y;
        y < this.currentArea.y + this.currentArea.h;
        y++
      ) {
        this.processed.set(x, y, true)
      }
    }
  }

  private getNextArea() {
    const lastArea = this.currentArea

    let x = 0
    let y = 0

    if (lastArea) y = lastArea.y

    // TODO: optimize
    while (!this.dataGetter(x, y) || this.processed.get(x, y)) {
      if (x >= this.width && y >= this.height) return null

      if (x >= this.width) {
        x = 0
        y++
      } else {
        x++
      }
    }

    return this.newArea(x, y)
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
      this.dataGetter(x, y) === this.currentArea.value &&
      !this.processed.get(x, y)
    )
  }
}
