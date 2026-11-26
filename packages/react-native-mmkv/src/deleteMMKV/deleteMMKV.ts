import { getNativeMMKV, initializeMMKV } from '../getNativeMMKV'
import { isTest } from '../isTest'

export function deleteMMKV(id: string): boolean {
  if (isTest()) {
    return true
  }

  initializeMMKV()
  return getNativeMMKV().deleteStorage(id)
}
