import * as THREE from 'three'
import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

export const voxelMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  transparent: true
})
