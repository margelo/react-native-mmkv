#include "MMKVApplePaths.hpp"
#import <Foundation/Foundation.h>
#include <stdexcept>

namespace margelo::nitro::mmkv {

std::string getAppleBaseDirectory() {
#if TARGET_OS_TV
  auto directory = NSCachesDirectory;
#else
  auto directory = NSDocumentDirectory;
#endif
  auto urls = [NSFileManager.defaultManager URLsForDirectory:directory inDomains:NSUserDomainMask];
  auto base = [urls.firstObject URLByAppendingPathComponent:@"mmkv" isDirectory:YES];
  if (base == nil)
    throw std::runtime_error("Cannot find base-path to store MMKV files!");
  return base.path.UTF8String;
}

std::string getAppleAppGroupDirectory() {
  NSString* group = [NSBundle.mainBundle objectForInfoDictionaryKey:@"AppGroupIdentifier"];
  if (![group isKindOfClass:NSString.class])
    return {};
  auto url = [NSFileManager.defaultManager containerURLForSecurityApplicationGroupIdentifier:group];
  if (url == nil)
    throw std::runtime_error("Container for AppGroup not accessible: " + std::string(group.UTF8String));
  return url.path.UTF8String;
}

} // namespace margelo::nitro::mmkv
