# React Nitro MMKV example

Run `bun install` at the repository root. From this directory, build for the iOS simulator or Android using the React Nitro CLI.

```sh
bun ios --build-only
bun android --build-only --abi arm64-v8a
```

The example displays a persistent launch count. To run the native storage test on a booted simulator or connected emulator:

```sh
bun test:harness --platform ios
bun test:harness --platform android
```
