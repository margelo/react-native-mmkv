//
//  HybridMMKV.hpp
//  react-native-mmkv
//
//  Created by Marc Rousavy on 21.08.2025.
//

#pragma once

#include "MMKVTypes.hpp"
#include <NitroMmkv/HybridMMKVPlatformContextSpecCxx.hpp>
#include <NitroMmkv/HybridMMKVSpec.hpp>

namespace margelo::nitro::mmkv {

class HybridMMKV final : public HybridMMKVSpec {
public:
  explicit HybridMMKV(const std::optional<Configuration>& configuration);
  ~HybridMMKV() override;

  static void initialize(const HybridMMKVPlatformContextSpecCxx& context);
  static void trimAll();
  static void checkAllContentChanged();
  static bool deleteStorage(const std::string& id);
  static bool storageExists(const std::string& id);

public:
  // Properties
  std::string getId() override;
  double getSize() override;
  double getByteSize() override;
  double getLength() override;
  bool getIsReadOnly() override;
  bool getIsEncrypted() override;

public:
  // Methods
  void setString(const std::string& key, const std::string& value) override;
  void setBoolean(const std::string& key, bool value) override;
  void setNumber(const std::string& key, double value) override;
  void setArrayBuffer(const std::string& key, const ArrayBuffer& value) override;
  void setBigInt(const std::string& key, int64_t value) override;
  std::optional<int64_t> getBigInt(const std::string& key) override;
  std::optional<bool> getBoolean(const std::string& key) override;
  std::optional<std::string> getString(const std::string& key) override;
  std::optional<double> getNumber(const std::string& key) override;
  std::optional<ArrayBuffer> getBuffer(const std::string& key) override;
  bool contains(const std::string& key) override;
  bool remove(const std::string& key) override;
  std::vector<std::string> getAllKeys() override;
  void clearAll() override;
  void recrypt(const std::optional<std::string>& key) override;
  void encrypt(const std::string& key, const std::optional<EncryptionType>& encryptionType) override;
  void decrypt() override;
  void trim() override;
  void checkContentChanged() override;
  Listener addOnValueChangedListener(const Callback<void(const std::string&)>& onValueChanged) override;
  double importAllFrom(const std::shared_ptr<HybridMMKVSpec>& other) override;

protected:
  size_t getExternalMemorySize() noexcept override;

private:
  template <typename Value>
  void write(const std::string& key, Value&& value);

  static MMKVMode getMMKVMode(const Configuration& config);
  static std::optional<MMKVRecoverStrategic> getRecoveryStrategy(const Configuration& config);

private:
  MMKV* instance;
};

} // namespace margelo::nitro::mmkv
