import { ChunkData } from '../ChunkData'
import { TerrainGenerator } from '../TerrainGenerator'

self.onmessage = (message) => {
  const { data } = message
  const {
    chunkX,
    chunkY,
    chunkZ,
    chunkWidth,
    chunkHeight,
    chunkDepth,
    terrainGeneratorSeed
  } = data

  const terrainGenerator = new TerrainGenerator(terrainGeneratorSeed)
  const chunkData = new ChunkData(chunkWidth, chunkHeight, chunkDepth)

  for (let x = 0; x < chunkWidth; x++) {
    for (let y = 0; y < chunkHeight; y++) {
      for (let z = 0; z < chunkDepth; z++) {
        const block = terrainGenerator.getBlock(
          x + chunkX * chunkWidth,
          y + chunkY * chunkHeight,
          z + chunkZ * chunkDepth
        )
        chunkData.set(x, y, z, block)
      }
    }
  }

  postMessage({ chunkData: chunkData.data.data })
}
