import { getNativeMMKV } from '../getNativeMMKV'
import { isTest } from '../isTest'

export function existsMMKV(id: string): boolean {
  if (isTest()) {
    return true
  }

  return getNativeMMKV().storageExists(id)
}
