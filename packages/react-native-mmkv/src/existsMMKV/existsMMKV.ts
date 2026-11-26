import { getNativeMMKV, initializeMMKV } from '../getNativeMMKV'
import { isTest } from '../isTest'

export function existsMMKV(id: string): boolean {
  if (isTest()) {
    return true
  }

  initializeMMKV()
  return getNativeMMKV().storageExists(id)
}
