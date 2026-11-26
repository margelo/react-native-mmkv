import type { MMKV as MMKVSpec } from './specs/MMKV.nitro'
import type { Configuration } from './specs/Configuration'
import { checkBigIntRange } from './checkBigIntRange'
import { createTextDecoder } from './web/createTextDecoder'
import { createTextEncoder } from './web/createTextEncoder'
import {
  getLocalStorage,
  LOCAL_STORAGE_KEY_WILDCARD,
} from './web/getLocalStorage'

export class MMKV implements MMKVSpec {
  private readonly keyPrefix: string
  private readonly textDecoder = createTextDecoder()
  private readonly textEncoder = createTextEncoder()
  private readonly listeners = new Set<(key: string) => void>()

  readonly id: string
  readonly isReadOnly = false
  readonly isEncrypted = false

  constructor(config?: Configuration) {
    if (config?.encryptionKey != null) {
      throw new Error("MMKV: 'encryptionKey' is not supported on Web!")
    }
    if (config?.path != null) {
      throw new Error("MMKV: 'path' is not supported on Web!")
    }

    this.id = config?.id ?? 'mmkv.default'
    if (this.id.includes(LOCAL_STORAGE_KEY_WILDCARD)) {
      throw new Error(
        'MMKV: `id` cannot contain the backslash character (`\\`)!'
      )
    }
    this.keyPrefix = this.id + LOCAL_STORAGE_KEY_WILDCARD
  }

  private prefixedKey(key: string): string {
    if (key.includes(LOCAL_STORAGE_KEY_WILDCARD)) {
      throw new Error(
        'MMKV: `key` cannot contain the backslash character (`\\`)!'
      )
    }
    return this.keyPrefix + key
  }

  private notifyListeners(key: string): void {
    this.listeners.forEach((listener) => listener(key))
  }

  get length(): number {
    return this.getAllKeys().length
  }

  get size(): number {
    return this.byteSize
  }

  get byteSize(): number {
    // Estimate assuming UTF-8.
    return JSON.stringify(getLocalStorage()).length
  }

  clearAll(): void {
    const storage = getLocalStorage()
    for (const key of this.getAllKeys()) {
      storage.removeItem(this.prefixedKey(key))
      this.notifyListeners(key)
    }
  }

  remove(key: string): boolean {
    const storage = getLocalStorage()
    const storageKey = this.prefixedKey(key)
    const existed = storage.getItem(storageKey) !== null
    storage.removeItem(storageKey)
    if (existed) this.notifyListeners(key)
    return existed
  }

  setString(key: string, value: string): void {
    if (key === '') throw new Error('Cannot set a value for an empty key!')
    getLocalStorage().setItem(this.prefixedKey(key), value)
    this.notifyListeners(key)
  }

  setNumber(key: string, value: number): void {
    this.setString(key, String(value))
  }

  setBoolean(key: string, value: boolean): void {
    this.setString(key, String(value))
  }

  setArrayBuffer(key: string, value: ArrayBuffer): void {
    this.setString(key, this.textDecoder.decode(value))
  }

  setBigInt(key: string, value: bigint): void {
    checkBigIntRange(value)
    this.setString(key, String(value))
  }

  getString(key: string): string | undefined {
    return getLocalStorage().getItem(this.prefixedKey(key)) ?? undefined
  }

  getNumber(key: string): number | undefined {
    const value = this.getString(key)
    return value === undefined ? undefined : Number(value)
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.getString(key)
    return value === undefined ? undefined : value === 'true'
  }

  getArrayBuffer(key: string): ArrayBuffer | undefined {
    const value = this.getString(key)
    return value === undefined
      ? undefined
      : this.textEncoder.encode(value).buffer
  }

  getBigInt(key: string): bigint | undefined {
    const value = this.getString(key)
    return value !== undefined && /^-?\d+$/.test(value)
      ? BigInt(value)
      : undefined
  }

  getAllKeys(): string[] {
    return Object.keys(getLocalStorage())
      .filter((key) => key.startsWith(this.keyPrefix))
      .map((key) => key.slice(this.keyPrefix.length))
  }

  contains(key: string): boolean {
    return this.getString(key) != null
  }

  recrypt(): void {
    throw new Error('`recrypt(..)` is not supported on Web!')
  }

  encrypt(): void {
    throw new Error('`encrypt(..)` is not supported on Web!')
  }

  decrypt(): void {
    throw new Error('`decrypt(..)` is not supported on Web!')
  }

  trim(): void {}

  checkContentChanged(): void {}

  dispose(): void {}

  equals(other: MMKVSpec): boolean {
    return this === other
  }

  addOnValueChangedListener(listener: (key: string) => void): {
    remove: () => void
  } {
    this.listeners.add(listener)
    return {
      remove: () => {
        this.listeners.delete(listener)
      },
    }
  }

  importAllFrom(other: MMKVSpec): number {
    const storage = getLocalStorage()
    let imported = 0
    for (const key of other.getAllKeys()) {
      const value = other.getString(key)
      if (value !== undefined) {
        storage.setItem(this.prefixedKey(key), value)
        imported++
      }
    }
    return imported
  }
}
