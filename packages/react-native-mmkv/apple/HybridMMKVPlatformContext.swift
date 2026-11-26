//
//  HybridMMKVPlatformContext.swift
//  react-native-mmkv
//
//  Created by Marc Rousavy on 25.03.24.
//

import Foundation
import NitroModules

final class HybridMMKVPlatformContext: HybridMMKVPlatformContextSpec {
  required override init() throws {
    try super.init()
  }

  private static var directory: FileManager.SearchPathDirectory {
#if os(tvOS)
    return .cachesDirectory
#else
    return .documentDirectory
#endif
  }
  
  func getBaseDirectory() throws -> String {
    // Get user documents directory
    let paths = FileManager.default.urls(for: Self.directory, in: .userDomainMask)
    guard let documentsPath = paths.first else {
      throw RuntimeError("Cannot find base-path to store MMKV files!")
    }
    
    // append /mmkv to it
    let basePath = documentsPath.appendingPathComponent("mmkv", conformingTo: .directory)
    return basePath.path
  }
  
  func getAppGroupDirectory() throws -> String? {
    // Read `AppGroupIdentifier` from `Info.plist`
    guard let appGroupID = Bundle.main.object(forInfoDictionaryKey: "AppGroupIdentifier") as? String else {
      return nil
    }
    // Get the URL for the AppGroup
    guard let url = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupID) else {
      throw RuntimeError("Container for AppGroup \"\(appGroupID)\" not accessible")
    }
    return url.path
  }
}
