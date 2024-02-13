import { Vertex } from "./ChunkMesher"

export type VertexPropertyName = 'positionX' | 'positionY' | 'positionZ' | 'blockId' | 'ao' | 'vertexIndex'
export type VertexPackage = {
  name: VertexPropertyName
  bits: number
  offset: number
  encodingMask: number
  decodingMask: number
}

export type VertexPackageInput = Pick<VertexPackage, "name" | "bits">

export const defaultVertexPackages: VertexPackageInput[] = [
  { name: 'vertexIndex', bits: 5 },
  { name: 'positionX', bits: 5 },
  { name: 'positionY', bits: 5 },
  { name: 'positionZ', bits: 5 },
  { name: 'blockId', bits: 8 },
  { name: 'ao', bits: 3 },
]

export class VertexPacker {
  public packages: VertexPackage[]
  public hash!: Record<VertexPropertyName, VertexPackage>
  public validator: VertexPackerValidator
  public calculator: VertexPackerCalculator

  constructor(VertexPackages: VertexPackageInput[] = defaultVertexPackages) {
    this.packages = VertexPackages.map((input) => {
      return {
        ...input,
        offset: 0,
        encodingMask: 0,
        decodingMask: 0
      }
    })

    this.validator = new VertexPackerValidator(this)
    this.validator.validateInput()

    this.calculator = new VertexPackerCalculator(this)
  }

  public calculateAll() {
    this.calculator.calculateAll()
    this.validator.validateCalculation()
    this.hash = this.calculator.calculatePackingHash()
  }

  public toUniforms() {
    // TODO: Implement
  }

  public packVertex(vertex: Vertex) {
    let vertexData = 0

    vertexData |= vertex.position[0] & this.hash.positionX.encodingMask << this.hash.positionX.offset
    vertexData |= vertex.position[1] & this.hash.positionY.encodingMask << this.hash.positionY.offset
    vertexData |= vertex.position[2] & this.hash.positionZ.encodingMask << this.hash.positionZ.offset
    vertexData |= vertex.blockId & this.hash.blockId.encodingMask << this.hash.blockId.offset
    vertexData |= vertex.ao & this.hash.ao.encodingMask << this.hash.ao.offset

    return vertexData
  }
}

class VertexPackerCalculator {
  public packages: VertexPackage[]

  constructor(packer: VertexPacker) {
    this.packages = packer.packages
  }

public calculateOffsets() {
    this.packages.reduce((offset, property) => {
      property.offset = offset
      return offset + property.bits
    }, 0)
  }

  public calculateMasks() {
    this.packages.forEach((property) => {
      property.encodingMask = (1 << property.bits) - 1
      property.decodingMask = property.encodingMask << property.offset
    })
  }

  public calculatePackingHash() {
    const hash: Record<VertexPropertyName, VertexPackage> = {} as Record<VertexPropertyName, VertexPackage>
    this.packages.forEach((property) => {
      hash[property.name] = property
    })
    return hash
  }

  public calculateAll() {
    this.calculateOffsets()
    this.calculateMasks()
    return this.calculatePackingHash()
  }
}


class VertexPackerValidator {
  public packages: VertexPackage[]

  constructor(packer: VertexPacker) {
    this.packages = packer.packages
  }

  public validateTotalBits() {
    const totalBits = this.packages.reduce((total, property) => {
      return total + property.bits
    }, 0)
    if (totalBits > 32) {
      throw new Error('Total bits exceeds 32')
    }
  }

  public validateNoOverlaps() {
    const offsets = this.packages.map((property) => property.offset)
    const uniqueOffsets = new Set(offsets)
    if (offsets.length !== uniqueOffsets.size) {
      throw new Error('Overlapping offsets')
    }
  }

  public validateNoGaps() {
    const sortedOffsets = this.packages.map((property) => property.offset).sort((a, b) => a - b)
    for (let i = 0; i < sortedOffsets.length - 1; i++) {
      if (sortedOffsets[i + 1] - sortedOffsets[i] !== this.packages[i].bits) {
        throw new Error('Gaps in offsets')
      }
    }
  }

  public validateAllPresent() {
    const properties = new Set(this.packages.map((property) => property.name))
    const requiredProperties = new Set<VertexPropertyName>(['positionX', 'positionY', 'positionZ', 'blockId', 'ao'])
    for (const property of requiredProperties) {
      if (!properties.has(property)) {
        throw new Error(`Missing property: ${property}`)
      }
    }
  }

  public validatePropertyDuplication() {
    const properties = new Set(this.packages.map((property) => property.name))
    if (properties.size !== this.packages.length) {
      throw new Error('Duplicate properties')
    }
  }

  public validateInput() {
    this.validateAllPresent()
    this.validatePropertyDuplication()
    this.validateTotalBits()
  }

  public validateCalculation() {
    this.validateNoOverlaps()
    this.validateNoGaps()
  }
}
