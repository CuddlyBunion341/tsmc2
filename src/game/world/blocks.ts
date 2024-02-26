export type Block = {
  id: number
  name: string
  transparent: boolean
  color: [number, number, number]
}

const paritalBlocks = [
  { name: 'air', transparent: true },
  { name: 'stone', color: [0.2, 0.2, 0.2] },
  { name: 'dirt', color: [0.2, 0.1, 0] },
  { name: 'grass', color: [0, 0.5, 0] },
  { name: 'water', color: [0, 0, 0.5] },
] as const

type BlockIdRecord = Record<(typeof paritalBlocks)[number]['name'], number>

export const blocks: Block[] = []
export const blockIds: Record<(typeof paritalBlocks)[number]['name'], number> =
  {} as BlockIdRecord

paritalBlocks.forEach((blockData, id) => {
  const block = { id, ...blockData }
  blocks.push(block as Block)
  blockIds[blockData.name] = block.id
})
