package com.margelo.nitro.bug

import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer

@DoNotStrip
class HybridCallbackBuilder(
  private val callback: MyCallback  // ✅ WORKS: Can store callback
) : HybridCallbackBuilderSpec() {

  private var message: String = "default"

  override fun setMessage(msg: String) {
    this.message = msg
  }

  override fun trigger() {
    // Create complex test data
    val complexData = ComplexData(
      url = "https://example.com/test",
      statusCode = 200.0,
      headers = mapOf("Content-Type" to "application/json", "X-Custom" to "value"),
      metadata = arrayOf("meta1", "meta2", "meta3")
    )

    // Create test ArrayBuffer
    val testData = "Test data here!".toByteArray()
    val buffer = ArrayBuffer.allocate(testData.size)
    val byteBuffer = buffer.getBuffer(false)
    byteBuffer.put(testData)
    byteBuffer.rewind()

    // ✅ Can call ALL callback methods with stored callback
    callback.onSimpleEvent(message)
    callback.onComplexEvent(complexData)
    callback.onDataReceived(complexData, buffer)
    callback.onMaybeData(complexData)
    callback.onMultiParam(complexData, buffer, null)
  }
}
