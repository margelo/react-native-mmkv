import { Android, Apple, type HybridObject } from 'nitro-core'

export * from '#nitro/MMKVPlatformContext'

@Apple({
  language: 'swift',
  implementation: { className: 'HybridMMKVPlatformContext' },
})
@Android({
  language: 'kotlin',
  implementation: { className: 'HybridMMKVPlatformContext' },
})
export declare class MMKVPlatformContext extends HybridObject {
  constructor()

  /**
   * Get the MMKV base directory
   */
  getBaseDirectory(): string
  /**
   * Get the MMKV AppGroup's directory.
   * The AppGroup can be set in your App's `Info.plist`, and will enable
   * data sharing between main app, companions (e.g. watch app) and extensions.
   * @platform iOS
   * @default undefined
   */
  getAppGroupDirectory(): string | undefined
}
