//
//  HybridMMKV.cpp
//  react-native-mmkv
//
//  Created by Marc Rousavy on 21.08.2025.
//

#include "HybridMMKV.hpp"
#include "MMKVTypes.hpp"
#include "MMKVValueChangedListenerRegistry.hpp"
#include <NitroModules/NitroLogger.hpp>

namespace margelo::nitro::mmkv {

HybridMMKV::HybridMMKV(const Configuration& config) {
  const std::string& id = config.id;
  MMKVMode mmkvMode = getMMKVMode(config);
  if (config.readOnly.value_or(false)) {
    mmkvMode = mmkvMode | MMKVMode::MMKV_READ_ONLY;
  }
  bool useAes256Encryption = config.encryptionType.value_or(EncryptionType::AES_128) == EncryptionType::AES_256;
  std::string encryptionKey = config.encryptionKey.value_or("");
  std::string* encryptionKeyPtr = encryptionKey.size() > 0 ? &encryptionKey : nullptr;
  std::string rootPath = config.path.value_or("");
  std::string* rootPathPtr = rootPath.size() > 0 ? &rootPath : nullptr;
  bool compareBeforeSet = config.compareBeforeSet.value_or(false);

  MMKVConfig mmkvConfig{.mode = mmkvMode,
                        .aes256 = useAes256Encryption,
                        .cryptKey = encryptionKeyPtr,
                        .rootPath = rootPathPtr,
                        .enableCompareBeforeSet = compareBeforeSet,
                        .recover = getRecoveryStrategy(config)};

  bool hasEncryptionKey = encryptionKey.size() > 0;
  Logger::log(LogLevel::Info, "MMKV", "Creating MMKV instance \"%s\"... (Path: %s, Encrypted: %s)", id.c_str(), rootPath.c_str(),
              hasEncryptionKey ? "true" : "false");

  instance = MMKV::mmkvWithID(id, mmkvConfig);

  if (instance == nullptr) [[unlikely]] {
    // Check if instanceId is invalid
    if (id.empty()) {
      throw std::runtime_error("Failed to create MMKV instance! `id` cannot be empty!");
    }

    if (useAes256Encryption) {
      // With AES-256, the max key length is 32 bytes.
      if (encryptionKey.size() > 32) [[unlikely]] {
        throw std::runtime_error("Failed to create MMKV instance! `encryptionKey` cannot be longer "
                                 "than 32 bytes with AES-256 encryption!");
      }
    } else {
      // With AES-128, the max key length is 16 bytes.
      if (encryptionKey.size() > 16) [[unlikely]] {
        throw std::runtime_error("Failed to create MMKV instance! `encryptionKey` cannot be longer "
                                 "than 16 bytes with AES-128 encryption!");
      }
    }

    // Check if path is maybe invalid
    if (rootPath.empty()) [[unlikely]] {
      throw std::runtime_error("Failed to create MMKV instance! `path` cannot be empty!");
    }

    throw std::runtime_error("Failed to create MMKV instance!");
  }
}

std::string HybridMMKV::getName() {
  return HybridObject::getName();
}

std::string HybridMMKV::getId() {
  return instance->mmapID();
}

double HybridMMKV::getLength() {
  return instance->count();
}

double HybridMMKV::getSize() {
  return getByteSize();
}

double HybridMMKV::getByteSize() {
  return instance->actualSize();
}

size_t HybridMMKV::getExternalMemorySize() noexcept {
  return instance != nullptr ? instance->actualSize() : 0;
}

bool HybridMMKV::getIsReadOnly() {
  return instance->isReadOnly();
}

bool HybridMMKV::getIsEncrypted() {
  return instance->isEncryptionEnabled();
}

void HybridMMKV::set(const std::string& key, const std::variant<bool, ArrayBuffer, std::string, double>& value) {
  if (key.empty()) [[unlikely]] {
    throw std::runtime_error("Cannot set a value for an empty key!");
  }

  const bool successful = std::visit(
      [&](const auto& item) {
        if constexpr (std::is_same_v<std::decay_t<decltype(item)>, ArrayBuffer>) {
          return instance->set(MMBuffer(item.data(), item.size(), MMBufferCopyFlag::MMBufferNoCopy), key);
        } else {
          return instance->set(item, key);
        }
      },
      value);
  if (!successful) [[unlikely]] {
    throw std::runtime_error("Failed to set value for key \"" + key + "\"!");
  }

  MMKVValueChangedListenerRegistry::notifyOnValueChanged(instance->mmapID(), key);
}

std::optional<bool> HybridMMKV::getBoolean(const std::string& key) {
  bool hasValue;
  bool result = instance->getBool(key, /* defaultValue */ false, &hasValue);
  if (hasValue) {
    return result;
  } else {
    return std::nullopt;
  }
}

std::optional<std::string> HybridMMKV::getString(const std::string& key) {
  std::string result;
  bool hasValue = instance->getString(key, result, /* inplaceModification */ true);
  if (hasValue) {
    return result;
  } else {
    return std::nullopt;
  }
}

std::optional<double> HybridMMKV::getNumber(const std::string& key) {
  bool hasValue;
  double result = instance->getDouble(key, /* defaultValue */ 0.0, &hasValue);
  if (hasValue) {
    return result;
  } else {
    return std::nullopt;
  }
}

std::optional<ArrayBuffer> HybridMMKV::getBuffer(const std::string& key) {
  MMBuffer result;
  if (!instance->getBytes(key, result)) {
    return std::nullopt;
  }
  if (result.length() == 0) {
    return ArrayBuffer::empty();
  }

  auto buffer = std::make_shared<MMBuffer>(std::move(result));
  auto* data = static_cast<uint8_t*>(buffer->getPtr());
  auto size = buffer->length();
  return ArrayBuffer::wrap(data, size, [buffer = std::move(buffer)] {});
}

bool HybridMMKV::contains(const std::string& key) {
  return instance->containsKey(key);
}

bool HybridMMKV::remove(const std::string& key) {
  bool wasRemoved = instance->removeValueForKey(key);
  if (wasRemoved) {
    // Notify on changed
    MMKVValueChangedListenerRegistry::notifyOnValueChanged(instance->mmapID(), key);
  }
  return wasRemoved;
}

std::vector<std::string> HybridMMKV::getAllKeys() {
  return instance->allKeys();
}

void HybridMMKV::clearAll() {
  auto keysBefore = getAllKeys();
  instance->clearAll();
  for (const auto& key : keysBefore) {
    // Notify on changed
    MMKVValueChangedListenerRegistry::notifyOnValueChanged(instance->mmapID(), key);
  }
}

void HybridMMKV::recrypt(const std::optional<std::string>& key) {
  if (key.has_value()) {
    encrypt(key.value(), std::nullopt);
  } else {
    decrypt();
  }
}

void HybridMMKV::encrypt(const std::string& key, const std::optional<EncryptionType>& encryptionType) {
  bool isAes256Encryption = encryptionType == EncryptionType::AES_256;
  bool successful = instance->reKey(key, isAes256Encryption);
  if (!successful) {
    throw std::runtime_error("Failed to encrypt MMKV instance!");
  }
}

void HybridMMKV::decrypt() {
  bool successful = instance->reKey("");
  if (!successful) [[unlikely]] {
    throw std::runtime_error("Failed to decrypt MMKV instance!");
  }
}

void HybridMMKV::trim() {
  instance->trim();
  instance->clearMemoryCache();
}

void HybridMMKV::checkContentChanged() {
  instance->checkContentChanged();
}

Listener HybridMMKV::addOnValueChangedListener(const Callback<void(const std::string&)>& onValueChanged) {
  // Add listener
  auto mmkvID = instance->mmapID();
  auto listenerID = MMKVValueChangedListenerRegistry::addListener(mmkvID, onValueChanged);

  return Listener(Callback<void()>::make([=]() {
    // remove()
    MMKVValueChangedListenerRegistry::removeListener(mmkvID, listenerID);
  }));
}

MMKVMode HybridMMKV::getMMKVMode(const Configuration& config) {
  if (!config.mode.has_value()) {
    return ::mmkv::MMKV_SINGLE_PROCESS;
  }
  switch (config.mode.value()) {
    case Mode::SINGLE_PROCESS:
      return ::mmkv::MMKV_SINGLE_PROCESS;
    case Mode::MULTI_PROCESS:
      return ::mmkv::MMKV_MULTI_PROCESS;
  }
  throw std::runtime_error("Invalid MMKV Mode value!");
}

std::optional<MMKVRecoverStrategic> HybridMMKV::getRecoveryStrategy(const Configuration& config) {
  if (!config.recoveryStrategy.has_value()) {
    return std::nullopt;
  }

  switch (config.recoveryStrategy.value()) {
    case RecoveryStrategy::DISCARD_ON_ERROR:
      return MMKVRecoverStrategic::OnErrorDiscard;
    case RecoveryStrategy::RECOVER_ON_ERROR:
      return MMKVRecoverStrategic::OnErrorRecover;
  }
  throw std::runtime_error("Invalid MMKV RecoveryStrategy value!");
}

double HybridMMKV::importAllFrom(const std::shared_ptr<HybridMMKVSpec>& other) {
  auto hybridMMKV = std::dynamic_pointer_cast<HybridMMKV>(other);
  if (hybridMMKV == nullptr) [[unlikely]] {
    throw std::runtime_error("The given `MMKV` instance is not of type `HybridMMKV`!");
  }

  size_t importedCount = instance->importFrom(hybridMMKV->instance);
  return static_cast<double>(importedCount);
}

} // namespace margelo::nitro::mmkv
