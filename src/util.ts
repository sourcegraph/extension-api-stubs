/**
 * Identity-function helper to ensure a value `T` is a subtype of `U`.
 *
 * @template U The type to check for (explicitly specify this)
 * @template T The actual type (inferred, don't specify this)
 */
// eslint-disable-next-line unicorn/consistent-function-scoping
export const subtypeOf = <U>() => <T extends U>(value: T): T => value

export function notImplemented(): never {
    throw new Error('Stub functionality not implemented')
}
