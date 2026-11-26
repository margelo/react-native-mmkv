import { Platform } from 'react-native'
import { addMemoryWarningListener } from './addMemoryWarningListener/addMemoryWarningListener'
import { addContentChangedListener } from './addContentChangedListener/addContentChangedListener'
import { isTest } from './isTest'
import { MockMMKV } from './MockMMKV'
import { getNativeMMKV, initializeMMKV } from './getNativeMMKV'
import type { MMKV as NativeMMKV } from './specs/MMKV.nitro'
import type { Configuration } from './specs/Configuration'

export type MMKV = NativeMMKV
export const MMKV: new (configuration?: Configuration) => MMKV = isTest()
  ? MockMMKV
  : new Proxy(getNativeMMKV(), {
      construct(NativeStorage, [configuration]: [Configuration?]) {
        const context = initializeMMKV()
        let config = configuration
        if (Platform.OS === 'ios' && config?.path == null) {
          const path = context.getAppGroupDirectory()
          if (path != null) config = { ...config, path }
        }

        const storage = new NativeStorage(config)
        addMemoryWarningListener(storage)
        addContentChangedListener(storage)
        return storage
      },
    })
