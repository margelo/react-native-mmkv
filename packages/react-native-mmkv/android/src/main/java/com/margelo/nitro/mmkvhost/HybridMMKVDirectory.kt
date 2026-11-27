package com.margelo.nitro.mmkvhost

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules

@Keep
@DoNotStrip
class HybridMMKVDirectory : HybridMMKVDirectorySpec() {
  companion object : HybridMMKVDirectorySpec.Companion {
    override fun getBaseDirectory(): String {
      val context = checkNotNull(NitroModules.applicationContext)
      return context.filesDir.resolve("mmkv").absolutePath
    }
  }
}
