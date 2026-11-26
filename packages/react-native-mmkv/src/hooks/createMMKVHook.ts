import { useCallback, useSyncExternalStore } from 'react'
import { getDefaultMMKVInstance } from '../getDefaultMMKVInstance'
import type { MMKV } from '../specs/MMKV.nitro'

const getServerSnapshot = () => undefined

export function createMMKVHook<
  T extends boolean | number | string | ArrayBuffer | bigint,
>(
  getter: (instance: MMKV, key: string) => T | undefined,
  setter: (instance: MMKV, key: string, value: T) => void
) {
  type Value = T | undefined
  type SetAction = Value | ((current: Value) => Value)
  return (
    key: string,
    instance?: MMKV
  ): [value: Value, setValue: (value: SetAction) => void] => {
    const mmkv = instance ?? getDefaultMMKVInstance()

    const value = useSyncExternalStore(
      useCallback(
        (onStoreChange: () => void) => {
          const listener = mmkv.addOnValueChangedListener((changedKey) => {
            if (changedKey === key) {
              onStoreChange()
            }
          })
          return () => listener.remove()
        },
        [key, mmkv]
      ),
      useCallback(() => getter(mmkv, key), [key, mmkv]),
      // Storage values are unset on the server and during hydration.
      getServerSnapshot
    )

    // update value by user set
    const set = useCallback(
      (action: SetAction) => {
        const newValue =
          typeof action === 'function' ? action(getter(mmkv, key)) : action
        if (newValue === undefined) {
          mmkv.remove(key)
        } else {
          setter(mmkv, key, newValue)
        }
      },
      [key, mmkv]
    )

    return [value, set]
  }
}
