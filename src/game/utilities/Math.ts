// Inspired by: https://www.youtube.com/watch?v=CSa5O6knuwI
export function linearSplineInterpolation(value: number, splinePoints: number[][]): number {
  if (splinePoints.length === 0) return value

  if (splinePoints[0][0] > value) throw new Error(`Value ${value} is less than the first spline point ${splinePoints[0][0]}`)
  if (splinePoints[splinePoints.length - 1][0] < value) throw new Error(`Value ${value} is greater than the last spline point ${splinePoints[splinePoints.length - 1][0]}`)

  for (let i = 0; i < splinePoints.length - 1; i++) {
    const [x0, y0] = splinePoints[i]
    const [x1, y1] = splinePoints[i + 1]

    if (value >= x0 && value <= x1) {
      const t = (value - x0) / (x1 - x0)
      return y0 + t * (y1 - y0)
    }
  }
  
  throw new Error(`Value ${value} is not within the spline points`)
}
