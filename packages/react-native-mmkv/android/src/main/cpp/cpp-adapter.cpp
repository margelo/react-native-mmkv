#include <MmkvHost/private/MmkvHostOnLoad.hpp>
#include <NitroMmkv/private/NitroMmkvOnLoad.hpp>
#include <fbjni/fbjni.h>
#include <jni.h>

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::mmkv::registerAllNatives();
    margelo::nitro::mmkvhost::registerAllNatives();
  });
}
