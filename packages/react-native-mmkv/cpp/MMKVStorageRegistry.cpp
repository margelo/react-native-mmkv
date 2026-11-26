#include "MMKVStorageRegistry.hpp"
#include <mutex>
#include <unordered_map>

namespace margelo::nitro::mmkv {
namespace {

  struct Storage {
    MMKV* instance;
    std::string id;
    bool inDefaultRoot;
  };

  // MMKV owns the pointers. Serialize opening and deleting storage with app lifecycle
  // operations so those operations never use a pointer invalidated by deleteMMKV().
  std::mutex storageMutex;
  std::unordered_map<const HybridMMKV*, Storage> openStorages;

} // namespace

MMKV* MMKVStorageRegistry::open(const HybridMMKV* owner, const std::string& id, const MMKVConfig& config) {
  if (id.empty()) {
    return nullptr;
  }

  std::lock_guard lock(storageMutex);
  auto storageNamespace = config.rootPath == nullptr ? MMKV::defaultNameSpace() : MMKV::nameSpace(*config.rootPath);
  auto* instance = storageNamespace.mmkvWithID(id, config);
  if (instance != nullptr) {
    bool inDefaultRoot = config.rootPath == nullptr || storageNamespace.getRootDir() == MMKV::defaultNameSpace().getRootDir();
    openStorages.emplace(owner, Storage{instance, id, inDefaultRoot});
  }
  return instance;
}

void MMKVStorageRegistry::forget(const HybridMMKV* owner) {
  std::lock_guard lock(storageMutex);
  openStorages.erase(owner);
}

bool MMKVStorageRegistry::remove(const std::string& id) {
  std::lock_guard lock(storageMutex);
  const bool removed = MMKV::removeStorage(id);
  if (removed) {
    std::erase_if(openStorages, [&](const auto& entry) { return entry.second.inDefaultRoot && entry.second.id == id; });
  }
  return removed;
}

void MMKVStorageRegistry::forEach(void (*visit)(MMKV&)) {
  std::lock_guard lock(storageMutex);
  for (const auto& entry : openStorages) {
    visit(*entry.second.instance);
  }
}

} // namespace margelo::nitro::mmkv
