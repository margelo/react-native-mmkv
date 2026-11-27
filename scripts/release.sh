#!/bin/bash

set -euo pipefail

for package in nitro-mmkv react-native-mmkv react-nitro-mmkv; do
  (cd "packages/$package" && npm publish)
done
