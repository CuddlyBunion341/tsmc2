export class Block {
  private static count = 0

  public readonly id: number

  constructor(public readonly name: string) {
    this.id = Block.count++
  }
}

export const blocks = {
  air: new Block('air'),
  stone: new Block('stone'),
  dirt: new Block('dirt'),
  grass: new Block('grass')
} as const
