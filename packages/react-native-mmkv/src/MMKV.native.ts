import { addMMKVAppStateListeners } from './addMMKVAppStateListeners'
import { MMKV } from './specs/MMKV.nitro'
import { MMKVPlatformContext } from './specs/MMKVPlatformContext.nitro'

MMKV.initialize(new MMKVPlatformContext())
addMMKVAppStateListeners(MMKV)

export { MMKV }
