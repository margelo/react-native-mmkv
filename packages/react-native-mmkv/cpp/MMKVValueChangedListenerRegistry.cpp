//
//  MMKVValueChangedListenerRegistry.cpp
//  react-native-mmkv
//
//  Created by Marc Rousavy on 21.08.2025.
//

#include "MMKVValueChangedListenerRegistry.hpp"

namespace margelo::nitro::mmkv {

// static members
std::atomic<ListenerID> MMKVValueChangedListenerRegistry::_listenersCounter = 0;

std::unordered_map<MMKVID, std::vector<ListenerSubscription>>& MMKVValueChangedListenerRegistry::listenersByID() {
  // Allocated once and intentionally never destroyed. A static map would be destroyed by
  // `exit()` (e.g. when quitting an iOS app running on macOS) while the JS thread can still
  // be removing listeners, and `removeListener` would then read a destroyed map.
  static auto* listeners = new std::unordered_map<MMKVID, std::vector<ListenerSubscription>>();
  return *listeners;
}

ListenerID MMKVValueChangedListenerRegistry::addListener(const std::string& mmkvID,
                                                         const std::function<void(const std::string& /* key */)>& callback) {
  // 1. Get (or create) the listeners array for these MMKV instances
  auto& listeners = listenersByID()[mmkvID];
  // 2. Get (and increment) the listener ID counter
  auto id = _listenersCounter.fetch_add(1);
  // 3. Add the listener to our array
  listeners.push_back(ListenerSubscription{
      .id = id,
      .callback = callback,
  });
  // 4. Return the ID used to unsubscribe later on
  return id;
}

void MMKVValueChangedListenerRegistry::removeListener(const std::string& mmkvID, ListenerID id) {
  // 1. Get the listeners array for these MMKV instances
  auto& listenersMap = listenersByID();
  auto entry = listenersMap.find(mmkvID);
  if (entry == listenersMap.end()) {
    // There's no more listeners for this instance anyways.
    return;
  }
  // 2. Remove all listeners where the ID matches. Should only be one.
  auto& listeners = entry->second;
  listeners.erase(std::remove_if(listeners.begin(), listeners.end(), [id](const ListenerSubscription& e) { return e.id == id; }),
                  listeners.end());
}

void MMKVValueChangedListenerRegistry::notifyOnValueChanged(const std::string& mmkvID, const std::string& key) {
  // 1. Get all listeners for the specific MMKV ID
  auto& listenersMap = listenersByID();
  auto entry = listenersMap.find(mmkvID);
  if (entry == listenersMap.end()) {
    // There are no listeners. Return
    return;
  }
  // 2. Call each listener.
  auto& listeners = entry->second;
  for (const auto& listener : listeners) {
    listener.callback(key);
  }
}

} // namespace margelo::nitro::mmkv
