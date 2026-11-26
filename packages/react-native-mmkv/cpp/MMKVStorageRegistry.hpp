#pragma once

#include "MMKVTypes.hpp"

namespace margelo::nitro::mmkv {

class HybridMMKV;

class MMKVStorageRegistry final {
public:
  static MMKV* open(const HybridMMKV* owner, const std::string& id, const MMKVConfig& config);
  static void forget(const HybridMMKV* owner);
  static bool remove(const std::string& id);
  static void forEach(void (*visit)(MMKV&));
};

} // namespace margelo::nitro::mmkv
