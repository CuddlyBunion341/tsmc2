// Generated entirely using github copilot!

export function Benchmark(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: unknown[]) {
    const start = performance.now()
    const result = originalMethod.apply(this, args)
    const end = performance.now()
    const duration = end - start

    console.log(
      `Running ${propertyKey}(${args.join(', ')}) took ${duration.toFixed(2)} ms`
    )

    return result
  }

  return descriptor
}
