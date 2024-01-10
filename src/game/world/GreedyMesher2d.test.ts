import { describe, test, expect } from 'vitest'
import { GreedyMesher2d } from './GreedyMesher2d_'

const dataGetterFn = (data: number[][]) => (x: number, y: number) => data[data.length - y - 1][x]

const greedyMesherFactory = (data: number[][]) =>
  new GreedyMesher2d(data[0].length, data.length, dataGetterFn(data), (v) => v === 0)

describe('#step()', () => {
  test('should grow until the edge', () => {
    const greedyMesher = greedyMesherFactory([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ])

    const steps = [
      { value: 1, x: 0, y: 0, w: 1, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 2, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 3, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 3, h: 2, state: 'growingY' },
      { value: 1, x: 0, y: 0, w: 3, h: 3, state: 'growingY' },
      { value: 1, x: 0, y: 0, w: 3, h: 3, state: 'done' }
    ]

    steps.forEach((step) => {
      expect(greedyMesher.currentArea).toMatchObject(step)
      greedyMesher.step()
    })
  })

  test('should stop growing when it hits a different value', () => {
    const greedyMesher = greedyMesherFactory([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 0]
    ])

    const steps = [
      { value: 1, x: 0, y: 0, w: 1, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 2, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 2, h: 2, state: 'growingY' }
    ]

    steps.forEach((step) => {
      expect(greedyMesher.currentArea).toMatchObject(step)
      greedyMesher.step()
    })
  })

  test('should place a new area once it is done growing', () => {
    const greedyMesher = greedyMesherFactory([
      [0, 1, 0],
      [1, 1, 2],
      [1, 1, 0]
    ])

    const steps = [
      { value: 1, x: 0, y: 0, w: 1, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 2, h: 1, state: 'growingX' },
      { value: 1, x: 0, y: 0, w: 2, h: 2, state: 'growingY' },
      { value: 2, x: 2, y: 1, w: 1, h: 1, state: 'growingX' }
    ]

    steps.forEach((step) => {
      expect(greedyMesher.currentArea).toMatchObject(step)
      greedyMesher.step()
    })
  })

  test('creates the correct areas', () => {
    const greedyMesher = greedyMesherFactory([
      [0, 1, 1],
      [1, 1, 2],
      [1, 1, 0]
    ])

    greedyMesher.call()

    expect(greedyMesher.areas).toMatchObject([
      { value: 1, x: 0, y: 0, w: 2, h: 2, state: 'done' },
      { value: 2, x: 2, y: 1, w: 1, h: 1, state: 'done' },
      { value: 1, x: 1, y: 2, w: 2, h: 1, state: 'done' }
    ])
  })
})
