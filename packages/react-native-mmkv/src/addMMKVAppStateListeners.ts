import { AppState } from 'react-native'
import type { MMKV } from './specs/MMKV.nitro'

export function addMMKVAppStateListeners(
  storage: Pick<typeof MMKV, 'trimAll' | 'checkAllContentChanged'>
): void {
  AppState.addEventListener('memoryWarning', () => storage.trimAll())
  AppState.addEventListener('change', (state) => {
    if (state === 'active') storage.checkAllContentChanged()
  })
}
