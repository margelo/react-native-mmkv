import 'react-native-nitro-modules'
import { Platform } from 'react-native'
import { nativeMMKV } from 'nitro-mmkv/native'
import type { MMKVDirectory } from './MMKVDirectory.nitro'
import { addMMKVAppStateListeners } from './addMMKVAppStateListeners'

if (Platform.OS === 'android') {
  const binding: {
    MMKVDirectory: typeof MMKVDirectory
  } = require('#nitro/MMKVDirectory')
  const directory = binding.MMKVDirectory.getBaseDirectory()
  nativeMMKV.initialize(directory)
} else {
  nativeMMKV.initialize()
}
addMMKVAppStateListeners(nativeMMKV)
