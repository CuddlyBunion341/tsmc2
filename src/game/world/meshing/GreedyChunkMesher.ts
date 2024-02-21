import * as THREE from "three";
import { ChunkData } from "../data/ChunkData";

export type MesherFace = {
  blockId: number
  aoValue: number
  normal: [number, number, number]
  position: [number, number, number]
  dimensions: [number, number, number]
}

export class GreedyChunkMesher {
  constructor(
    public readonly dimensions: THREE.Vector3,
    public readonly chunkData: ChunkData
  ) { }
}
