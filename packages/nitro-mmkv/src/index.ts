import { MMKV as PlatformMMKV } from '#mmkv'
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
