import { Chunk, ChunkMessageData } from '../Chunk'

self.onmessage = (message: MessageEvent<ChunkMessageData>) => {
  const { data } = message

  const chunk = Chunk.fromMessageData(data)
  chunk.generateTerrain()

  const uint8Array = chunk.chunkData.data.data

  self.postMessage(uint8Array, { transfer: [uint8Array.buffer] })
}
