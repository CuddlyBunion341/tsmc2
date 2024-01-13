import { ShaderMaterial } from 'three'
import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

export const shaderMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader
})
