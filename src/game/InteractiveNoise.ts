import { FractalNoise2d } from './utilities/Noise'
import { Engine } from '../engine/Engine'

// 180 x 180 ~= 32 * 32 * 32

export class InteractiveNoise {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public noise: FractalNoise2d
  public executionTime: string
  public resolution: number = 32

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
    addSlider('frequency', 1, 80)
    addSlider('lacunarity', 2, 10, 1)
    addSlider('persistence', 2, 10, 1)

    engine.debug.gui.add(this, 'executionTime').listen()
    engine.debug.gui
      .add(this, 'resolution', [16, 32, 64, 128, 256, 512])
      .onChange(() => this.updateCanvasSize())

    this.updateImage()
  }

  public updateCanvasSize() {
    this.canvas.width = this.resolution
    this.canvas.height = this.resolution
    this.updateImage()
  }

  public updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const start = performance.now()
    for (let x = 0; x < this.resolution; x++) {
      for (let y = 0; y < this.resolution; y++) {
        const value = this.noise.get(x, y)
        const color = Math.floor((value + 1) * 128)
        this.ctx.fillStyle = `rgb(${color}, ${color}, ${color})`
        this.ctx.fillRect(x, y, 1, 1)
      }
    }
    const end = performance.now()
    this.executionTime = `${Math.floor(end - start)}ms`
  }
}
