cmake_minimum_required(VERSION 3.13)
project(MmkvHost)

set(generated "${MMKV_CORE_DIR}/nitrogen/generated")
file(GLOB core_sources CONFIGURE_DEPENDS
  "${MMKV_CORE_DIR}/cpp/*.cpp"
  "${generated}/shared/c++/*.cpp"
  "${generated}/android/c++/*.cpp"
)
add_library(MmkvHost SHARED
  src/main/cpp/cpp-adapter.cpp
  ${core_sources}
  "${generated}/android/NitroMmkvOnLoad.cpp"
)
include(../nitrogen/generated/android/MmkvHost+autolinking.cmake)
target_include_directories(MmkvHost PRIVATE
  "${MMKV_CORE_DIR}/cpp"
  "${generated}/shared/c++/include"
  "${generated}/android/include"
)
if(DEFINED MMKV_LOG_LEVEL)
  target_compile_definitions(MmkvHost PRIVATE MMKV_LOG_LEVEL=${MMKV_LOG_LEVEL})
endif()
find_package(mmkv REQUIRED CONFIG)
target_link_libraries(MmkvHost mmkv::mmkv android log)
