import type { MMKV as MMKVSpec } from './specs/MMKV.nitro'
import type { Configuration } from './specs/Configuration'
import { checkBigIntRange } from './checkBigIntRange'

type Value = string | boolean | number | ArrayBuffer | bigint

export class MMKV implements MMKVSpec {
  private readonly storage = new Map<string, Value>()
  private readonly listeners = new Set<(key: string) => void>()

  readonly id: string
  readonly isReadOnly = false
  readonly isEncrypted = false

  static existsInstance(_id: string): boolean {
    return true
  }

  static deleteInstance(_id: string): boolean {
    return true
  }

  constructor(config?: Configuration) {
    this.id = config?.id ?? 'mmkv.default'
  }

  get length(): number {
    return this.storage.size
  }

  get size(): number {
    return this.byteSize
  }

  get byteSize(): number {
    return JSON.stringify(this.storage).length
  }

  clearAll(): void {
    const keys = this.getAllKeys()
    this.storage.clear()
    keys.forEach((key) => this.notifyListeners(key))
  }

  remove(key: string): boolean {
    const deleted = this.storage.delete(key)
    if (deleted) this.notifyListeners(key)
    return deleted
  }

  private notifyListeners(key: string): void {
    this.listeners.forEach((listener) => listener(key))
  }

  private write(key: string, value: Value): void {
    if (key === '') throw new Error('Cannot set a value for an empty key!')
    this.storage.set(key, value)
    this.notifyListeners(key)
  }

  setString(key: string, value: string): void {
    this.write(key, value)
  }

  setNumber(key: string, value: number): void {
    this.write(key, value)
  }

  setBoolean(key: string, value: boolean): void {
    this.write(key, value)
  }

  setArrayBuffer(key: string, value: ArrayBuffer): void {
    this.write(key, value)
  }

  setBigInt(key: string, value: bigint): void {
    checkBigIntRange(value)
    this.write(key, value)
  }

  getString(key: string): string | undefined {
    const result = this.storage.get(key)
    return typeof result === 'string' ? result : undefined
  }

  getNumber(key: string): number | undefined {
    const result = this.storage.get(key)
    return typeof result === 'number' ? result : undefined
  }

  getBoolean(key: string): boolean | undefined {
    const result = this.storage.get(key)
    return typeof result === 'boolean' ? result : undefined
  }

  getArrayBuffer(key: string): ArrayBuffer | undefined {
    const result = this.storage.get(key)
    return result instanceof ArrayBuffer ? result : undefined
  }

  getBigInt(key: string): bigint | undefined {
    const result = this.storage.get(key)
    return typeof result === 'bigint' ? result : undefined
  }

  getAllKeys(): string[] {
    return Array.from(this.storage.keys())
  }

  contains(key: string): boolean {
    return this.storage.has(key)
  }

  recrypt(): void {
    console.warn('Encryption is not supported in mocked MMKV instances!')
  }

  encrypt(): void {
    console.warn('Encryption is not supported in mocked MMKV instances!')
  }

  decrypt(): void {
    console.warn('Encryption is not supported in mocked MMKV instances!')
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
    let imported = 0
    for (const key of other.getAllKeys()) {
      const value =
        other instanceof MMKV
          ? other.storage.get(key)
          : other.getArrayBuffer(key)
      if (value !== undefined) {
        this.storage.set(key, value)
        imported++
      }
    }
    return imported
  }
}
