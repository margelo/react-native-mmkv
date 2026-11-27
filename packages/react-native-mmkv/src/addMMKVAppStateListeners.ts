import { AppState } from 'react-native'

export function addMMKVAppStateListeners(storage: {
  trimAll(): void
  checkAllContentChanged(): void
}): void {
  AppState.addEventListener('memoryWarning', () => storage.trimAll())
  AppState.addEventListener('change', (state) => {
    if (state === 'active') storage.checkAllContentChanged()
  })
}
