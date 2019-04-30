/**
 * Compile-time helper to assert a given type.
 */
export const assertTypeIsCompatible = <T>(val: T): void => undefined

export function notImplemented(): never {
    throw new Error('Stub functionality not implemented')
}
