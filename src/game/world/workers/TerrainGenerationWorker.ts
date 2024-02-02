import { Chunk, ChunkMessageData } from '../Chunk'

self.onmessage = (message: { data: ChunkMessageData }) => {
  const { data } = message

  const chunk = Chunk.fromMessageData(data)
  chunk.generateTerrain()

  const arrayBuffer = chunk.chunkData.data.data.buffer

  postMessage(arrayBuffer, [arrayBuffer])
}
