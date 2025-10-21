package com.margelo.nitro.bug

import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class HybridCallbackTester : HybridCallbackTesterSpec() {
  override fun createBuilder(callback: MyCallback): HybridCallbackBuilderSpec {
    return HybridCallbackBuilder(callback) // Pass callback to builder
  }
}
