import ReactNitroApp
import ReactNitroDev
import ReactNitroRuntime
import UIKit

@main
final class AppDelegate: ReactNitroAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    reactNitroRegisterAppModules()
    registerDevLoader()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
