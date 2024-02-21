import { Chunk, ChunkMessageData } from '../data/Chunk'

self.onmessage = (message: MessageEvent<ChunkMessageData>) => {
  const { data } = message

  const chunk = Chunk.fromMessageData(data)
  chunk.generateTerrain()

  const uint8Array = chunk.chunkData.data

  self.postMessage(uint8Array, { transfer: [uint8Array.buffer] })
}
