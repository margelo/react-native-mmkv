import { Android, Apple, type HybridObject, type Int64 } from 'nitro-core'
import type { Configuration, EncryptionType } from './Configuration'
import type { MMKVPlatformContext } from './MMKVPlatformContext.nitro'

export * from '#nitro/MMKV'

export interface Listener {
  remove: () => void
}

@Apple({
  language: 'c++',
  implementation: { className: 'HybridMMKV', include: '"HybridMMKV.hpp"' },
})
@Android({
  language: 'c++',
  implementation: { className: 'HybridMMKV', include: '"HybridMMKV.hpp"' },
})
export declare class MMKV extends HybridObject {
  constructor(configuration?: Configuration)

  /** Check whether storage with the given ID exists. */
  static existsInstance(id: string): boolean
  /** Delete the storage with the given ID. */
  static deleteInstance(id: string): boolean

  /** @internal */
  static initialize(context: MMKVPlatformContext): void
  /** @internal */
  static trimAll(): void
  /** @internal */
  static checkAllContentChanged(): void

  /**
   * Get the ID of this {@linkcode MMKV} instance.
   */
  readonly id: string
  /**
   * Get the current amount of key/value pairs stored in
   * this storage.
   */
  readonly length: number
  /**
   * Get the current total size of the storage, in bytes.
   * @deprecated Use {@linkcode byteSize} instead.
   */
  readonly size: number
  /**
   * Get the current total size of the storage, in bytes.
   */
  readonly byteSize: number
  /**
   * Get whether this instance is in read-only mode or not.
   * If this is `true`, you can only use "get"-functions.
   */
  readonly isReadOnly: boolean
  /**
   * Get whether this instance is encrypted, or not.
   * @see {@linkcode encrypt | encrypt(...)}
   * @see {@linkcode decrypt | decrypt()}
   */
  readonly isEncrypted: boolean
  /**
   * Set a {@linkcode value} for the given {@linkcode key}.
   *
   * @throws an Error if the {@linkcode key} is empty.
   * @throws an Error if the {@linkcode value} cannot be set.
   */
  setString(key: string, value: string): void
  /**
   * Store a boolean. The key must be non-empty, and the storage must be writable.
   */
  setBoolean(key: string, value: boolean): void
  /**
   * Store a double-precision number. The key must be non-empty, and the storage must be writable.
   */
  setNumber(key: string, value: number): void
  /**
   * Store raw bytes. The key must be non-empty, and the storage must be writable.
   */
  setArrayBuffer(key: string, value: ArrayBuffer): void
  /**
   * Store a signed 64-bit integer.
   * @throws If the key is empty, the write fails, or the value is outside -2^63 through 2^63 - 1.
   */
  setBigInt(key: string, value: Int64): void
  /**
   * Get the signed 64-bit integer for the given key, or `undefined` if it does not exist.
   */
  getBigInt(key: string): Int64 | undefined
  /**
   * Get the boolean value for the given `key`, or `undefined` if it does not exist.
   *
   * @default undefined
   */
  getBoolean(key: string): boolean | undefined
  /**
   * Get the string value for the given `key`, or `undefined` if it does not exist.
   *
   * @default undefined
   */
  getString(key: string): string | undefined
  /**
   * Get the number value for the given `key`, or `undefined` if it does not exist.
   *
   * @default undefined
   */
  getNumber(key: string): number | undefined
  /**
   * Get a raw buffer of unsigned 8-bit (0-255) data.
   *
   * @default undefined
   */
  getArrayBuffer(key: string): ArrayBuffer | undefined
  /**
   * Checks whether the given `key` is being stored in this MMKV instance.
   */
  contains(key: string): boolean
  /**
   * Removes the given `key`.
   * @returns true if the key was removed, false otherwise
   */
  remove(key: string): boolean
  /**
   * Get all keys.
   *
   * @default []
   */
  getAllKeys(): string[]
  /**
   * Clears all keys/values.
   */
  clearAll(): void
  /**
   * Sets (or updates) the encryption-key to encrypt all data in this MMKV instance with.
   *
   * To remove encryption, pass `undefined` as a key.
   *
   * Encryption keys can have a maximum length of 16 bytes.
   *
   * @throws an Error if the instance cannot be recrypted.
   * @deprecated Use {@linkcode encrypt | encrypt(...)} or {@linkcode decrypt | decrypt()} instead.
   */
  recrypt(key: string | undefined): void
  /**
   * Encrypts the data in this MMKV instance with the
   * given {@linkcode key} and {@linkcode encryptionType}.
   *
   * If this MMKV instance is already encrypted ({@linkcode isEncrypted}),
   * it will re-encrypt the data.
   *
   * Future attempts to open this MMKV instance will require the same
   * {@linkcode key} and {@linkcode encryptionType}, otherwise reads
   * will fail.
   *
   * The {@linkcode key} must be 16-bytes in {@linkcode EncryptionType | 'AES-128'}
   * encryption (the default), or 32-bytes in {@linkcode EncryptionType | 'AES-256'}
   * encryption.
   *
   * @param key The encryption key to use. In AES-128 this must be 16-bytes, in AES-256 it must be 32-bytes long.
   * @param encryptionType The encryption type to use. Default: AES-128
   */
  encrypt(key: string, encryptionType?: EncryptionType): void
  /**
   * Decrypts the data in this MMKV instance and removes
   * the encryption key.
   *
   * Future attempts to open this MMKV instance must be done
   * without an encryption key, as it is now plain-text.
   */
  decrypt(): void
  /**
   * Trims the storage space and clears memory cache.
   *
   * Since MMKV does not resize itself after deleting keys, you can call `trim()`
   * after deleting a bunch of keys to manually trim the memory- and
   * disk-file to reduce storage and memory usage.
   *
   * In most applications, this is not needed at all.
   */
  trim(): void
  /**
   * Checks whether the underlying storage file changed outside this process,
   * and reloads this instance's data if needed.
   */
  checkContentChanged(): void
  /**
   * Adds a value changed listener. The Listener will be called whenever any value
   * in this storage instance changes (set or delete).
   *
   * To unsubscribe from value changes, call `remove()` on the Listener.
   */
  addOnValueChangedListener(onValueChanged: (key: string) => void): Listener

  /**
   * Imports all keys and values from the
   * given other {@linkcode MMKV} instance.
   * @returns the number of imported keys/values.
   */
  importAllFrom(other: MMKV): number
}
