// swift-tools-version: 6.4
import PackageDescription

let package = Package(
  name: "ReactNativeMmkv",
  platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .visionOS(.v1)],
  products: [.library(name: "ReactNativeMmkv", targets: ["ReactNativeMmkv"])],
  dependencies: [.package(path: "../NitroMmkv")],
  targets: [.target(name: "ReactNativeMmkv", dependencies: [.product(name: "NitroMmkv", package: "NitroMmkv")], path: "apple", publicHeadersPath: ".")],
  cxxLanguageStandard: .cxx20
)
