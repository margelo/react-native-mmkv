/**
 * Configures the mode of the MMKV instance.
 * - `single-process`: The MMKV instance is only used from a single process (this app).
 * - `multi-process`: The MMKV instance may be used from multiple processes, such as app clips, share extensions or background services.
 */
export type Mode = 'single-process' | 'multi-process'

/**
 * Configures the encryption algorithm for the MMKV instance.
 * - `AES-128`: Uses AES-128 encryption (default).
 * - `AES-256`: Uses AES-256 encryption for enhanced security.
 */
export type EncryptionType = 'AES-128' | 'AES-256'

/**
 * Configures how MMKV should handle recoverable storage errors.
 * - `discard-on-error`: Discards data when MMKV detects a CRC or file-length error.
 * - `recover-on-error`: Attempts to recover data when MMKV detects a CRC or file-length error.
 */
export type RecoveryStrategy = 'discard-on-error' | 'recover-on-error'

/**
 * Used for configuration of a single MMKV instance.
 */
export interface Configuration {
  /**
   * The MMKV instance's ID. If you want to use multiple instances, make sure to use different IDs!
   *
   * @example
   * ```ts
   * const userStorage = new MMKV({ id: `user-${userId}-storage` })
   * const globalStorage = new MMKV({ id: 'global-app-storage' })
   * ```
   *
   * @default 'mmkv.default'
   */
  id?: string
  /**
   * The MMKV instance's root path. By default, MMKV stores file inside `$(Documents)/mmkv/`. You can customize MMKV's root directory on MMKV initialization:

   * @example
   * ```ts
   * const temporaryStorage = new MMKV({ path: '/tmp/' })
   * ```
   *
   * @note On iOS, if an `AppGroup` is set in `Info.plist` and `path` is `undefined`, MMKV will use the `AppGroup` directory.
   * App Groups allow you to share MMKV storage between apps, widgets and extensions within the same AppGroup bundle.
   * For more information, see [the `Configuration` section](https://github.com/Tencent/MMKV/wiki/iOS_tutorial#configuration).
   *
   * @default undefined
   */
  path?: string
  /**
   * The MMKV instance's encryption/decryption key. By default, MMKV stores all key-values in plain text on file, relying on iOS's sandbox to make sure the file is encrypted. Should you worry about information leaking, you can choose to encrypt MMKV.
   *
   * Encryption keys can have a maximum length of 16 bytes with AES-128 encryption and 32 bytes with AES-256 encryption.
   *
   * @example
   * ```ts
   * const secureStorage = new MMKV({ encryptionKey: '0123456789abcdef' })
   * ```
   *
   * @default undefined
   */
  encryptionKey?: string
  /**
   * The encryption algorithm to use when an encryption key is provided.
   *
   * @example
   * ```ts
   * const secureStorage = new MMKV({
   *   id: 'secure-storage',
   *   encryptionKey: '0123456789abcdef0123456789abcdef',
   *   encryptionType: 'AES-256'
   * })
   * ```
   *
   * @default 'AES-128'
   */
  encryptionType?: EncryptionType
  /**
   * Configure the processing mode for MMKV.
   *
   * @default 'single-process'
   */
  mode?: Mode
  /**
   * If `true`, the MMKV instance can only read from the storage, but not write to it.
   * This is more efficient if you do not need to write to it.
   * @default false
   */
  readOnly?: boolean
  /**
   * If `true`, MMKV will internally compare a value for equality before writing to
   * disk, and if the new value is equal to what is already stored, it will skip
   * the file write.
   * Treat this as an optional performance optimization.
   * @default false
   */
  compareBeforeSet?: boolean
  /**
   * Configure how MMKV should handle recoverable storage errors.
   *
   * @default undefined
   */
  recoveryStrategy?: RecoveryStrategy
}
