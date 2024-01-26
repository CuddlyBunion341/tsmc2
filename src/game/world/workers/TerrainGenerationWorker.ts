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

  for (let x = -1; x < chunkWidth + 1; x++) {
    for (let y = -1; y < chunkHeight + 1; y++) {
      for (let z = -1; z < chunkDepth + 1; z++) {
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
