package com.margelo.nitro.mmkvhost

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.reactnitro.runtime.NitroActivity
import com.margelo.reactnitro.runtime.NitroActivityInitializer

@Keep
@DoNotStrip
class HybridMMKVDirectory : HybridMMKVDirectorySpec() {
  companion object : HybridMMKVDirectorySpec.Companion, NitroActivityInitializer {
    private lateinit var directory: String

    override fun onCreate(activity: NitroActivity) {
      directory = activity.filesDir.resolve("mmkv").absolutePath
    }

    override fun getBaseDirectory(): String = directory
  }
}
