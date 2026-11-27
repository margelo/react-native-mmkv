import { createMMKVHook } from './createMMKVHook'

/**
 * Use the signed 64-bit integer stored at `key`.
 * If no instance is provided, a shared default instance will be used.
 */
export const useMMKVBigInt = createMMKVHook(
  (instance, key) => instance.getBigInt(key),
  (instance, key, value) => instance.setBigInt(key, value)
)
