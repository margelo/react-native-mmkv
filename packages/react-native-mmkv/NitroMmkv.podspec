require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# React Native CLI uses the podspec to discover this package for SwiftPM autolinking.
Pod::Spec.new do |s|
  s.name = "NitroMmkv"
  s.version = package["version"]
  s.summary = package["description"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.authors = package["author"]
  s.source = { :git => "https://github.com/margelo/react-native-mmkv.git", :tag => "v#{s.version}" }
  s.ios.deployment_target = "16.0"
  s.osx.deployment_target = "13.0"
  s.tvos.deployment_target = "16.0"
  s.visionos.deployment_target = "1.0"
end
