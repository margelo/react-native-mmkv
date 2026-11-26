import { MMKV as PlatformMMKV } from '#react-native-mmkv'
import type { MMKV as MMKVSpec } from './specs/MMKV.nitro'

// All types
export type {
  Configuration,
  EncryptionType,
  Mode,
  RecoveryStrategy,
} from './specs/Configuration'

export type MMKV = MMKVSpec
export const MMKV: typeof MMKVSpec = PlatformMMKV

// All the hooks
export { useMMKV } from './hooks/useMMKV'
export { useMMKVBigInt } from './hooks/useMMKVBigInt'
export { useMMKVBoolean } from './hooks/useMMKVBoolean'
export { useMMKVBuffer } from './hooks/useMMKVBuffer'
export { useMMKVNumber } from './hooks/useMMKVNumber'
export { useMMKVObject } from './hooks/useMMKVObject'
export { useMMKVString } from './hooks/useMMKVString'
export { useMMKVListener } from './hooks/useMMKVListener'
export { useMMKVKeys } from './hooks/useMMKVKeys'
