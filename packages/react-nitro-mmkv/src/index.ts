import { Platform } from 'react-nitro-core'
import { nativeMMKV } from 'nitro-mmkv/native'
import type { MMKVDirectory } from './MMKVDirectory.nitro'

if (Platform.OS === 'android') {
  const binding: {
    MMKVDirectory: typeof MMKVDirectory
  } = require('#nitro/MMKVDirectory')
  const directory = binding.MMKVDirectory.getBaseDirectory()
  nativeMMKV.initialize(directory)
} else {
  nativeMMKV.initialize()
}

export * from 'nitro-mmkv'
export * from 'nitro-mmkv/react'
