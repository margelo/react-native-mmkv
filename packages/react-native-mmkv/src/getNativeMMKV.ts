import type { MMKV } from './specs/MMKV.nitro'
import { addMMKVAppStateListeners } from './addMMKVAppStateListeners'

let nativeMMKV: typeof MMKV | undefined

export function getNativeMMKV(): typeof MMKV {
  if (nativeMMKV == null) {
    // The mock can be used without loading Nitro or accessing native storage.
    require('react-native-nitro-modules')
    const { MMKV: Storage } =
      require('./specs/MMKV.nitro') as typeof import('./specs/MMKV.nitro')
    const { MMKVPlatformContext } =
      require('./specs/MMKVPlatformContext.nitro') as typeof import('./specs/MMKVPlatformContext.nitro')

    Storage.initialize(new MMKVPlatformContext())
    addMMKVAppStateListeners(Storage)
    nativeMMKV = Storage
  }
  return nativeMMKV
}
