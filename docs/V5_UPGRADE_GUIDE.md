# V5 Upgrade Guide

MMKV V5 uses Nitro V1. To upgrade an app from V4, update the native dependencies, then migrate storage creation and writes.

## Native setup

Use React Native 0.88 or newer with the New Architecture. Install the Nitro V1 dependencies listed in the [installation instructions](../README.md#installation).

iOS builds use Swift Package Manager and require Swift 6.4 or newer. If your app uses CocoaPods, run this command from the app directory to migrate it to SwiftPM.

```sh
npx react-native spm add --deintegrate
```

## Create a storage instance

Import `MMKV` and pass the existing configuration to its constructor.

```diff
- import { createMMKV } from 'react-native-mmkv'
+ import { MMKV } from 'react-native-mmkv'

- const storage = createMMKV({ id: 'app-storage' })
+ const storage = new MMKV({ id: 'app-storage' })
```

Use the same instance ID, path, and encryption settings to open your existing data.

## Write values

Replace each `set()` call with the setter for the value type.

| V4                          | V5                                    |
| --------------------------- | ------------------------------------- |
| `storage.set(key, text)`    | `storage.setString(key, text)`        |
| `storage.set(key, enabled)` | `storage.setBoolean(key, enabled)`    |
| `storage.set(key, count)`   | `storage.setNumber(key, count)`       |
| `storage.set(key, buffer)`  | `storage.setArrayBuffer(key, buffer)` |

Read ArrayBuffers with `getBuffer()`. For signed 64-bit integers, use `setBigInt()` and `getBigInt()`.
