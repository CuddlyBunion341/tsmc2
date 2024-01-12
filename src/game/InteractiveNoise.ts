import { FractalNoise2d } from './utilities/Noise'
import { Engine } from '../engine/Engine'

type ColorRamp = {
  min: number
  max: number
  value: string
}

export class InteractiveNoise {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public noise: FractalNoise2d
  public executionTime: string
  public resolution: number = 32
  public colors: ColorRamp[] = [
    { min: -1, max: -0.8, value: '#493212' },
    { min: -0.8, max: -0.6, value: '#68491b' },
    { min: -0.6, max: -0.4, value: '#7b571d' },
    { min: -0.4, max: -0.2, value: '#805c22' },
    { min: -0.2, max: 0, value: '#73501b' },
    { min: 0, max: 0.2, value: '#563e18' },
    { min: 0.2, max: 0.4, value: '#936526' },
    { min: 0.4, max: 0.6, value: '#624417' },
    { min: 0.6, max: 0.8, value: '#b67e2b' },
    { min: 0.8, max: 1, value: '#b67e2b' }
  ]
  // public colors: ColorRamp[] = [
  //   { min: -1, max: -0.8, value: '#0000ff' },
  //   { min: -0.8, max: -0.6, value: '#3366ff' },
  //   { min: -0.6, max: -0.4, value: '#66a3ff' },
  //   { min: -0.4, max: -0.2, value: '#99ccff' },
  //   { min: -0.2, max: 0, value: '#cce5ff' },
  //   { min: 0, max: 0.2, value: '#ffffcc' },
  //   { min: 0.2, max: 0.4, value: '#ffff99' },
  //   { min: 0.4, max: 0.6, value: '#ffff66' },
  //   { min: 0.6, max: 0.8, value: '#ffff33' },
  //   { min: 0.8, max: 1, value: '#ffff00' }
  // ]

  public min = -1
  public max = 1

  constructor(public engine: Engine) {
    this.executionTime = `0ms`

    this.noise = new FractalNoise2d(69420, 2)

    const canvas = document.createElement('canvas')
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    this.ctx = ctx

    this.updateCanvasSize()

    document.body.appendChild(canvas)
    canvas.setAttribute(
      'style',
      `
      position: absolute;
      top: 0;
      left: 0;
      image-rendering: pixelated;
      aspect-ratio: 1;
      height: 100%;
      `
    )

    const addSlider = (
      name: string,
      min: number,
      max: number,
      step: number = 0.01
    ) => {
      engine.debug.gui
        .add(this.noise, name, min, max)
        .onChange(() => this.updateImage())
        .step(step)
    }

    addSlider('octaves', 1, 10, 1)
    addSlider('frequencyX', 1, 80)
    addSlider('frequencyY', 1, 80)
    addSlider('lacunarity', 2, 10, 1)
    addSlider('persistence', 2, 10, 1)

    engine.debug.gui.add(this, 'executionTime').listen()
    engine.debug.gui
      .add(this, 'resolution', [16, 32, 64, 128, 180, 256, 512])
      .onChange(() => this.updateCanvasSize())

    const updateRampMin = (index: number, value: number) => {
      if (index === 0) return
      this.colors[index].min = value
      this.colors[index - 1].max = value
      this.updateImage()
    }

    const updateRampMax = (index: number, value: number) => {
      if (index >= this.colors.length) return
      this.colors[index].max = value
      this.colors[index + 1].min = value
      this.updateImage()
    }

    this.colors.forEach((ramp, index) => {
      const folder = engine.debug.gui.addFolder(`Color ${index}`)

      folder
        .add(ramp, 'min', -1, 1, 0.1)
        .onChange((v: number) => updateRampMin(index, v))
        .listen()
      folder
        .add(ramp, 'max', -1, 1, 0.1)
        .onChange((v: number) => updateRampMax(index, v))
        .listen()
      folder.addColor(ramp, 'value').onChange(() => this.updateImage())
    })

    this.updateImage()
  }

  public updateCanvasSize() {
    this.canvas.width = this.resolution
    this.canvas.height = this.resolution
    this.updateImage()
  }

  public getColor(value: number) {
    const color = this.colors.find((c) => value >= c.min && value <= c.max)
    // if (!color) throw new Error('Could not find color')
    if (!color) return '#000000'

    return color.value
  }

  public updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const start = performance.now()
    for (let x = 0; x < this.resolution; x++) {
      for (let y = 0; y < this.resolution; y++) {
        const value = Math.min(
          Math.max(this.noise.get(x, y), this.min),
          this.max
        )

        const color = this.getColor(value)

        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, 1, 1)
      }
    }
    const end = performance.now()
    this.executionTime = `${Math.floor(end - start)}ms`
  }
}
