#import <Foundation/Foundation.h>
#include <NitroMmkv/NitroMmkvAutolinking.hpp>

/**
 * Registers all HybridObject classes of NitroMmkv
 * when the app loads, so JS can look them up by name.
 */
@interface NitroMmkvAutolinking : NSObject
@end

@implementation NitroMmkvAutolinking

+ (void)load {
  margelo::nitro::mmkv::registerHybridClasses();
}

@end
