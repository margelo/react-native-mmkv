# react-nitro-mmkv

Install both packages as app dependencies so React Nitro discovers the native storage module and its host bindings during preparation.

```sh
bun add react-nitro-mmkv nitro-mmkv
bun run react-nitro prepare
```

```ts
import { MMKV, useMMKVString } from 'react-nitro-mmkv'

const storage = new MMKV({ id: 'preferences' })
storage.setString('theme', 'dark')

export function useTheme() {
  return useMMKVString('theme', storage)
}
```
