import { MMKV } from './MMKV'

let defaultInstance: MMKV | null = null
export function getDefaultMMKVInstance(): MMKV {
  if (defaultInstance == null) {
    defaultInstance = new MMKV()
  }
  return defaultInstance
}
