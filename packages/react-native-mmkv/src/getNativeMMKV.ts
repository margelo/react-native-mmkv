import type { MMKV } from './specs/MMKV.nitro'
import type { MMKVPlatformContext } from './specs/MMKVPlatformContext.nitro'

let platformContext: MMKVPlatformContext | undefined

export function getNativeMMKV(): typeof MMKV {
  // Defer loading the native bindings so tests can use MockMMKV.
  require('react-native-nitro-modules')
  return (require('./specs/MMKV.nitro') as typeof import('./specs/MMKV.nitro'))
    .MMKV
}

export function initializeMMKV(): MMKVPlatformContext {
  if (platformContext == null) {
    const { MMKVPlatformContext } =
      require('./specs/MMKVPlatformContext.nitro') as typeof import('./specs/MMKVPlatformContext.nitro')
    const context = new MMKVPlatformContext()
    getNativeMMKV().initialize(context.getBaseDirectory())
    platformContext = context
  }
  return platformContext
}
