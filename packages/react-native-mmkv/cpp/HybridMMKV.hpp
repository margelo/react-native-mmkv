//
//  HybridMMKV.hpp
//  react-native-mmkv
//
//  Created by Marc Rousavy on 21.08.2025.
//

#pragma once

#include "Configuration.hpp"
#include "HybridMMKVSpec.hpp"
#include "MMKVTypes.hpp"
#include <atomic>
#include <mutex>
#include <unordered_set>

namespace margelo::nitro::mmkv {

class HybridMMKV final : public HybridMMKVSpec {
public:
  explicit HybridMMKV(const Configuration& configuration);
  ~HybridMMKV() override;

public:
  /**
   * Makes every live instance of the MMKV file `id` in `rootPath` (MMKV's root
   * directory if empty) unusable. Call it before deleting the file:
   * `MMKV::removeStorage(...)` destroys the native instance they all point to.
   */
  static void invalidateInstances(const std::string& id, const std::string& rootPath = "");

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
  void set(const std::string& key, const std::variant<bool, std::shared_ptr<ArrayBuffer>, std::string, double>& value) override;
  std::optional<bool> getBoolean(const std::string& key) override;
  std::optional<std::string> getString(const std::string& key) override;
  std::optional<double> getNumber(const std::string& key) override;
  std::optional<std::shared_ptr<ArrayBuffer>> getBuffer(const std::string& key) override;
  bool contains(const std::string& key) override;
  bool remove(const std::string& key) override;
  std::vector<std::string> getAllKeys() override;
  void clearAll() override;
  void recrypt(const std::optional<std::string>& key) override;
  void encrypt(const std::string& key, std::optional<EncryptionType> encryptionType) override;
  void decrypt() override;
  void trim() override;
  void checkContentChanged() override;
  Listener addOnValueChangedListener(const std::function<void(const std::string& /* key */)>& onValueChanged) override;
  double importAllFrom(const std::shared_ptr<HybridMMKVSpec>& other) override;

protected:
  size_t getExternalMemorySize() noexcept override;

private:
  static MMKVMode getMMKVMode(const Configuration& config);
  static std::optional<MMKVRecoverStrategic> getRecoveryStrategy(const Configuration& config);

private:
  /**
   * The native instance, or throws if it was deleted with `deleteMMKV(...)`.
   */
  MMKV* getInstance() const;

private:
  std::atomic<MMKV*> _instance;
  std::string _id;
  std::string _rootPath;

  static std::mutex _liveInstancesMutex;
  static std::unordered_set<HybridMMKV*> _liveInstances;
};

} // namespace margelo::nitro::mmkv
