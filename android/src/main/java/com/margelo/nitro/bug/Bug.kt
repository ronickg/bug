package com.margelo.nitro.bug
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class Bug : HybridBugSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
