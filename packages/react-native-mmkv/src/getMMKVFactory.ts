import type { MMKVFactory } from './specs/MMKVFactory.nitro'
import type { MMKVPlatformContext } from './specs/MMKVPlatformContext.nitro'

let factory: MMKVFactory | undefined
let platformContext: MMKVPlatformContext | undefined

export function getPlatformContext(): MMKVPlatformContext {
  if (platformContext == null) {
    require('react-native-nitro-modules')
    const { MMKVPlatformContext } =
      require('./specs/MMKVPlatformContext.nitro') as typeof import('./specs/MMKVPlatformContext.nitro')
    platformContext = new MMKVPlatformContext()
  }
  return platformContext
}

export function getMMKVFactory(): MMKVFactory {
  if (factory == null) {
    const context = getPlatformContext()
    const { MMKVFactory } =
      require('./specs/MMKVFactory.nitro') as typeof import('./specs/MMKVFactory.nitro')
    const storageFactory = new MMKVFactory()
    storageFactory.initializeMMKV(context.getBaseDirectory())
    factory = storageFactory
  }
  return factory
}
