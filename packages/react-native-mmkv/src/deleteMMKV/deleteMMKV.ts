import { getNativeMMKV } from '../getNativeMMKV'
import { isTest } from '../isTest'

export function deleteMMKV(id: string): boolean {
  if (isTest()) {
    return true
  }

  return getNativeMMKV().deleteStorage(id)
}
