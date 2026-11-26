# TinyBase persistence

Use TinyBase's [`createCustomPersister`](https://tinybase.org/api/persisters/functions/creation/createcustompersister/) to save a store with MMKV.

```ts
import { MMKV } from 'react-native-mmkv'
import { createStore } from 'tinybase'
import { createCustomPersister } from 'tinybase/persisters'

const storage = new MMKV()
const storageKey = 'my_tinybase'

const store = createStore().setTables({ pets: { fido: { species: 'dog' } } })
const persister = createCustomPersister(
  store,
  async () => {
    const value = storage.getString(storageKey)
    return value === undefined ? undefined : JSON.parse(value)
  },
  async (getContent) => {
    storage.setString(storageKey, JSON.stringify(getContent()))
  },
  (listener) =>
    storage.addOnValueChangedListener((key) => {
      if (key === storageKey) listener()
    }),
  (subscription) => subscription.remove()
)

await persister.load()
await persister.startAutoSave()
```
