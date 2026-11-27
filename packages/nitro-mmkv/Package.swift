// swift-tools-version: 6.4
import Foundation
import PackageDescription

// The two autolinkers stage the Nitro runtime under different SwiftPM identities.
let directory = URL(fileURLWithPath: Context.packageDirectory)
let reactNative = directory.lastPathComponent == "NitroMmkv"
let runtime = reactNative ? "NitroModules" : "nitro-core"
let generated = "nitrogen/generated"
let logLevel = ProcessInfo.processInfo.environment["MMKV_LOG_LEVEL"]
let logSettings = logLevel.map { [CXXSetting.define("MMKV_LOG_LEVEL", to: $0)] } ?? []

let package = Package(
  name: "NitroMmkv",
  platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .visionOS(.v1)],
  products: [.library(name: "NitroMmkv", targets: ["NitroMmkv"])],
  dependencies: [
    .package(path: "../\(runtime)"),
    .package(url: "https://github.com/Tencent/MMKV.git", exact: "2.4.2"),
  ],
  targets: [
    .target(
      name: "NitroMmkv",
      dependencies: [
        .product(name: "NitroModules", package: runtime),
        .product(name: "MMKVCore", package: "MMKV"),
      ],
      path: ".",
      sources: ["cpp", "apple", "\(generated)/shared/c++", "\(generated)/apple/c++/HybridMMKVSpecClass.cpp", "\(generated)/apple/NitroMmkvAutolinking.cpp"],
      publicHeadersPath: "\(generated)/apple/c++/include",
      cxxSettings: [
        .define("DEBUG", .when(configuration: .debug)),
        .define("NDEBUG", .when(configuration: .release)),
        .disableWarning("nullability-extension"),
        .headerSearchPath("cpp"),
        .headerSearchPath("\(generated)/shared/c++/include"),
      ] + logSettings
    ),
  ],
  cxxLanguageStandard: .cxx20
)
