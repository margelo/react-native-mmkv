import { Android, type HybridObject } from 'nitro-core'

export * from '#nitro/MMKVDirectory'

@Android({
  language: 'kotlin',
  implementation: { className: 'HybridMMKVDirectory' },
})
export declare class MMKVDirectory extends HybridObject {
  static getBaseDirectory(): string
}
