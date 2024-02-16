import { WebGLRenderer } from 'three'
import { Engine } from './Engine'
import * as THREE from 'three'
import { GameEntity } from './GameEntity'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { RenderTarget } from './RenderTarget'

export class RenderEngine implements GameEntity {
  private readonly renderer: WebGLRenderer
  composer: EffectComposer
  target: RenderTarget

  constructor(private engine: Engine) {
    this.renderer = new WebGLRenderer({
      canvas: this.engine.canvas,
      antialias: true,
    })

    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.engine.sizes.pixelRatio, 2))

    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(
      this.engine.scene,
      this.engine.camera.instance
    )
    this.composer.addPass(renderPass)
    this.target = new RenderTarget()
  }

  update() {
    this.target.instance.depthTexture
    this.composer.render()
  }

  resize() {
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.composer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.target.updateSize(this.engine.sizes.width, this.engine.sizes.height)
    this.composer.render()
  }
}
