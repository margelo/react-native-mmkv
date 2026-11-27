import { MMKV } from './specs/MMKV.nitro'

interface NativeMMKV {
  initialize(androidBaseDirectory?: string): void
  trimAll(): void
  checkAllContentChanged(): void
}

export const nativeMMKV: NativeMMKV = MMKV
