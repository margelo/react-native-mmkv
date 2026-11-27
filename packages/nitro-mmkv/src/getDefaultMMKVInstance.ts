import { MMKV as MMKVConstructor } from '#mmkv'
import type { MMKV } from './specs/MMKV.nitro'

let defaultInstance: MMKV | null = null
export function getDefaultMMKVInstance(): MMKV {
  if (defaultInstance == null) {
    defaultInstance = new MMKVConstructor()
  }
  return defaultInstance
}
