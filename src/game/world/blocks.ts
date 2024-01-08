export type Block = {
  id: number
  name: string
  transparent: boolean
}

const paritalBlocks = [
  { name: 'air', transparent: true },
  { name: 'stone' },
  { name: 'dirt' },
  { name: 'grass' }
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
