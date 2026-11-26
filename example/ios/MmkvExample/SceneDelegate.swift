import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit

class SceneDelegate: RCTDefaultReactNativeFactoryDelegate, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }

    dependencyProvider = RCTAppDependencyProvider()
    let factory = RCTReactNativeFactory(delegate: self)
    reactNativeFactory = factory
    window = UIWindow(windowScene: windowScene)

    factory.startReactNative(
      withModuleName: "MmkvExample",
      in: window,
      connectionOptions: connectionOptions
    )
  }

  func scene(_ scene: UIScene, openURLContexts urlContexts: Set<UIOpenURLContext>) {
    RCTLinkingManager.scene(scene, openURLContexts: urlContexts)
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
