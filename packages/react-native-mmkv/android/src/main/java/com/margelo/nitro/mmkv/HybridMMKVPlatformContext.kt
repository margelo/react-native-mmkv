package com.margelo.nitro.mmkv

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules

@DoNotStrip
@Keep
class HybridMMKVPlatformContext: HybridMMKVPlatformContextSpec() {
    companion object : HybridMMKVPlatformContextSpec.Companion {
        override fun constructor(): HybridMMKVPlatformContext = HybridMMKVPlatformContext()
    }

    override fun getBaseDirectory(): String {
        val context = NitroModules.applicationContext ?: throw Error("Cannot get MMKV base directory - No Android Context available!")
        return context.filesDir.absolutePath + "/mmkv"
    }

    override fun getAppGroupDirectory(): String? = null
}
