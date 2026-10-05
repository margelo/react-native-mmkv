// swift-tools-version: 6.0
// AUTO-SCAFFOLDED by react-native spm scaffold — safe to edit & commit via patch-package.
// AUTO-SCAFFOLDED-VERSION: 19
// Cache slot: 0.87.1/dual-flavor
// Edit the contents below if needed and re-run `npx patch-package <dep-name>`
// to persist across `npm install`. To regenerate from the podspec, remove
// this file (or just this marker) and re-run `npx react-native spm scaffold`.
//
// Package references are plain relative paths, computed when this file was
// scaffolded. They stay correct because the file is re-scaffolded per app
// and cache slot, and any node_modules relayout reinstalls this package
// (dropping the file) anyway.

import PackageDescription

let package = Package(
    name: "ReactNativeMmkv",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "ReactNativeMmkv", targets: ["ReactNativeMmkv"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "ReactNativeMmkv",
            dependencies: [.product(name: "ReactHeaders", package: "ReactNative"), .product(name: "ReactNativeHeaders", package: "ReactNative"), .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"), .product(name: "ReactAppHeaders", package: "React-GeneratedCode")],
            path: ".",
            sources: [
                "MMKV/Core/CodedInputData.cpp",
                "MMKV/Core/CodedInputData.h",
                "MMKV/Core/CodedInputDataCrypt.cpp",
                "MMKV/Core/CodedInputDataCrypt.h",
                "MMKV/Core/CodedInputDataCrypt_OSX.cpp",
                "MMKV/Core/CodedInputData_OSX.cpp",
                "MMKV/Core/CodedOutputData.cpp",
                "MMKV/Core/CodedOutputData.h",
                "MMKV/Core/InterProcessLock.cpp",
                "MMKV/Core/InterProcessLock.h",
                "MMKV/Core/InterProcessLock_Android.cpp",
                "MMKV/Core/InterProcessLock_Win32.cpp",
                "MMKV/Core/KeyValueHolder.cpp",
                "MMKV/Core/KeyValueHolder.h",
                "MMKV/Core/MMBuffer.cpp",
                "MMKV/Core/MMBuffer.h",
                "MMKV/Core/MMKV.cpp",
                "MMKV/Core/MMKV.h",
                "MMKV/Core/MMKVLog.cpp",
                "MMKV/Core/MMKVLog.h",
                "MMKV/Core/MMKVLog_Android.cpp",
                "MMKV/Core/MMKVMetaInfo.hpp",
                "MMKV/Core/MMKVPredef.h",
                "MMKV/Core/MMKV_Android.cpp",
                "MMKV/Core/MMKV_IO.cpp",
                "MMKV/Core/MMKV_IO.h",
                "MMKV/Core/MMKV_OSX.cpp",
                "MMKV/Core/MMKV_OSX.h",
                "MMKV/Core/MemoryFile.cpp",
                "MMKV/Core/MemoryFile.h",
                "MMKV/Core/MemoryFile_Android.cpp",
                "MMKV/Core/MemoryFile_Linux.cpp",
                "MMKV/Core/MemoryFile_OSX.cpp",
                "MMKV/Core/MemoryFile_Win32.cpp",
                "MMKV/Core/MiniPBCoder.cpp",
                "MMKV/Core/MiniPBCoder.h",
                "MMKV/Core/MiniPBCoder_OSX.cpp",
                "MMKV/Core/PBEncodeItem.hpp",
                "MMKV/Core/PBUtility.cpp",
                "MMKV/Core/PBUtility.h",
                "MMKV/Core/ScopedLock.hpp",
                "MMKV/Core/ThreadLock.cpp",
                "MMKV/Core/ThreadLock.h",
                "MMKV/Core/ThreadLock_Win32.cpp",
                "MMKV/Core/aes/AESCrypt.cpp",
                "MMKV/Core/aes/AESCrypt.h",
                "MMKV/Core/aes/openssl/openssl_aes-armv4.S",
                "MMKV/Core/aes/openssl/openssl_aes.h",
                "MMKV/Core/aes/openssl/openssl_aes_core.cpp",
                "MMKV/Core/aes/openssl/openssl_aes_locl.h",
                "MMKV/Core/aes/openssl/openssl_aesv8-armx.S",
                "MMKV/Core/aes/openssl/openssl_arm_arch.h",
                "MMKV/Core/aes/openssl/openssl_cfb128.cpp",
                "MMKV/Core/aes/openssl/openssl_md32_common.h",
                "MMKV/Core/aes/openssl/openssl_md5.h",
                "MMKV/Core/aes/openssl/openssl_md5_dgst.cpp",
                "MMKV/Core/aes/openssl/openssl_md5_locl.h",
                "MMKV/Core/aes/openssl/openssl_md5_one.cpp",
                "MMKV/Core/aes/openssl/openssl_opensslconf.h",
                "MMKV/Core/crc32/Checksum.h",
                "MMKV/Core/crc32/crc32_armv8.cpp",
                "MMKV/Core/crc32/zlib/crc32.cpp",
                "MMKV/Core/crc32/zlib/crc32.h",
                "MMKV/Core/crc32/zlib/zconf.h",
                "MMKV/Core/crc32/zlib/zutil.h",
                "cpp/MMKVManagedBuffer.h",
                "cpp/MmkvHostObject.cpp",
                "cpp/MmkvHostObject.h",
                "cpp/MmkvLogger.h",
                "cpp/NativeMmkvModule.cpp",
                "cpp/NativeMmkvModule.h",
                "ios/AppleLogger.mm",
                "ios/MmkvOnLoad.mm",
                "ios/MmkvPlatformContext.h",
                "ios/MmkvPlatformContextModule.mm",
            ],
            publicHeadersPath: "ios",
            cSettings: [.headerSearchPath("MMKV/Core"), .headerSearchPath("MMKV/Core/aes"), .headerSearchPath("MMKV/Core/aes/openssl"), .headerSearchPath("MMKV/Core/crc32"), .headerSearchPath("MMKV/Core/crc32/zlib"), .headerSearchPath("cpp"), .headerSearchPath("ios"), .headerSearchPath("."), .unsafeFlags(["-include", "react-native-spm-prefix.h"])],
            cxxSettings: [.headerSearchPath("MMKV/Core"), .headerSearchPath("MMKV/Core/aes"), .headerSearchPath("MMKV/Core/aes/openssl"), .headerSearchPath("MMKV/Core/crc32"), .headerSearchPath("MMKV/Core/crc32/zlib"), .headerSearchPath("cpp"), .headerSearchPath("ios"), .headerSearchPath("."), .unsafeFlags(["-include", "react-native-spm-prefix.h"]), .unsafeFlags(["-x", "objective-c++"]), .define("DEBUG", .when(configuration: .debug)), .define("NDEBUG", .when(configuration: .release))],
            linkerSettings: [.linkedFramework("UIKit"), .linkedFramework("Foundation"), .linkedFramework("CoreGraphics")]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
