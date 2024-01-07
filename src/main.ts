import './style.scss'
import { Engine } from './engine/Engine'
import Game from './game/main'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Game
})
