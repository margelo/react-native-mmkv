import { useCallback, useRef, useSyncExternalStore } from 'react'
import { getDefaultMMKVInstance } from '../createMMKV/getDefaultMMKVInstance'
import type { MMKV } from '../specs/MMKV.nitro'

export function createMMKVHook<
  T extends (boolean | number | string | ArrayBufferLike) | undefined,
  TSet extends T | undefined,
  TSetAction extends TSet | ((current: T) => TSet),
>(getter: (instance: MMKV, key: string) => T) {
  return (
    key: string,
    instance?: MMKV
  ): [value: T, setValue: (value: TSetAction) => void] => {
    const mmkv = instance ?? getDefaultMMKVInstance()

    const cachedInstance = useRef<MMKV | undefined>(undefined)
    const cachedKey = useRef<string | undefined>(undefined)
    const cachedValue = useRef<T | undefined>(undefined)
    if (cachedInstance.current !== mmkv || cachedKey.current !== key) {
      // Initialize or update `cachedValue` when React props change.
      cachedInstance.current = mmkv
      cachedKey.current = key
      cachedValue.current = getter(mmkv, key)
    }

    const getSnapshot = useCallback(() => cachedValue.current as T, [])
    const value = useSyncExternalStore(
      useCallback(
        (onStoreChange: () => void) => {
          const listener = mmkv.addOnValueChangedListener((changedKey) => {
            if (changedKey === key) {
              // `getBuffer(..)` returns a new ArrayBuffer every time - only read on change
              cachedValue.current = getter(mmkv, key)
              onStoreChange()
            }
          })
          // The value might have changed between render and subscribe
          const latestValue = getter(mmkv, key)
          if (latestValue !== cachedValue.current) {
            cachedValue.current = latestValue
            onStoreChange()
          }
          return () => listener.remove()
        },
        [key, mmkv]
      ),
      getSnapshot,
      getSnapshot
    )

    // update value by user set
    const set = useCallback(
      (v: TSetAction) => {
        const newValue = typeof v === 'function' ? v(getter(mmkv, key)) : v
        switch (typeof newValue) {
          case 'number':
          case 'string':
          case 'boolean':
            mmkv.set(key, newValue)
            break
          case 'undefined':
            mmkv.remove(key)
            break
          case 'object':
            if (newValue instanceof ArrayBuffer) {
              mmkv.set(key, newValue)
              break
            } else {
              throw new Error(
                `MMKV: Type object (${newValue}) is not supported!`
              )
            }
          default:
            throw new Error(`MMKV: Type ${typeof newValue} is not supported!`)
        }
      },
      [key, mmkv]
    )

    return [value, set]
  }
}
