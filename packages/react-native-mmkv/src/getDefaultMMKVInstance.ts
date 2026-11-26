import { MMKV as MMKVConstructor } from '#react-native-mmkv'
import type { MMKV } from './specs/MMKV.nitro'

let defaultInstance: MMKV | null = null
export function getDefaultMMKVInstance(): MMKV {
  if (defaultInstance == null) {
    defaultInstance = new MMKVConstructor()
  }
  return defaultInstance
}
