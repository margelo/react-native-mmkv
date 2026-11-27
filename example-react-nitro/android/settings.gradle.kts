pluginManagement {
  val nitro = java.util.Properties()
  val paths = file("../.nitro/android/paths.properties")
  val reader = paths.reader(Charsets.UTF_8)
  reader.use { nitro.load(it) }
  val cliDirectory = nitro.getProperty("cliDirectory")
  val pluginDirectory = File(cliDirectory, "android/gradle-plugin")
  includeBuild(pluginDirectory)
  repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories { google(); mavenCentral() }
}
rootProject.name = "MmkvExample"

val nitro = java.util.Properties()
val paths = file("../.nitro/android/paths.properties")
val reader = paths.reader(Charsets.UTF_8)
reader.use { nitro.load(it) }
include(":app", ":runtime")
val runtimePath = nitro.getProperty("runtimeDirectory")
val runtimeDirectory = file(runtimePath)
project(":runtime").projectDir = runtimeDirectory
val configDirectory = nitro.getProperty("configDirectory")
gradle.beforeProject {
  extensions.extraProperties.set("reactNitroConfigDirectory", configDirectory)
}
