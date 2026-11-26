import type { MMKV as NativeMMKV } from './specs/MMKV.nitro'
import type { Configuration } from './specs/Configuration'
import { getNativeMMKV } from './getNativeMMKV'
import { isTest } from './isTest'

export type MMKV = NativeMMKV
export const MMKV: new (configuration?: Configuration) => MMKV = isTest()
  ? (require('./MMKV.mock') as typeof import('./MMKV.mock')).MMKV
  : getNativeMMKV()
