import { BlockGrid } from '../../util/BlockGrid'

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
  public processed: BlockGrid<boolean>
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
    this.processed = new BlockGrid(width, height, false)
    this.isDone = false
  }

  public call() {
    while (this.step());

    return this.areas
  }

  public step() {
    if (this.currentArea.state === 'growingX') this.growX()
    else if (this.currentArea.state === 'growingY') this.growY()
    else if (this.currentArea.state === 'done') this.prepareNextArea()
    else throw new Error(`Invalid state: ${this.currentArea.state}`)

    return !this.isDone
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

  private prepareNextArea() {
    this.areas.push(this.currentArea)
    this.updateProcessed()

    const next = this.getNextArea()
    if (next) this.currentArea = next
    else this.isDone = true
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

    let initialX = lastArea.x + lastArea.w
    let initialY = lastArea.y

    if (initialX >= this.width) {
      initialX = 0
      initialY++
    }

    for (let y = initialY; y < this.height; y++) {
      for (let x = initialX; x < this.width; x++) {
        if (this.processed.get(x, y)) continue
        if (this.skip(this.dataGetter(x, y))) continue

        return this.newArea(x, y)
      }
    }

    return null
  }

  private newArea(x: number, y: number): Area<T> {
    return { value: this.dataGetter(x, y), x, y, w: 1, h: 1, state: 'growingX' }
  }
}
