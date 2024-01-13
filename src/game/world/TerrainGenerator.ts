export class TerrainGenerator {
  constructor(public readonly seed: number) {}

  public getBlock(x: number, y: number, z: number) {
    return Math.random() > 0.99 ? 0 : 1
  }
}
