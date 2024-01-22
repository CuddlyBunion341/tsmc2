export type TypedArray = Uint8Array | Int8Array | Float32Array

export function bufferToGrid(
  width: number,
  height: number,
  depth: number,
  buffer: TypedArray
) {
  const grid = new Array(height)
    .fill(0)
    .map(() => new Array(width).fill(0).map(() => new Array(depth).fill(0)))

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        const index = x + y * width + z * width * height
        grid[y][x][z] = buffer[index]
      }
    }
  }

  return grid
}

export function gridToBuffer<T extends TypedArray>(
  grid: number[][][],
  bufferConstructor: new (length: number) => T
) {
  const height = grid.length
  const width = grid[0].length
  const depth = grid[0][0].length

  const buffer = new bufferConstructor(width * height * depth)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        const index = x + y * width + z * width * height
        buffer[index] = grid[y][x][z]
      }
    }
  }

  return buffer
}
