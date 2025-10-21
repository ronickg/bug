import Foundation
import NitroModules
class HybridCallbackTester: HybridCallbackTesterSpec {
  func createBuilder(callback: MyCallback) throws -> any HybridCallbackBuilderSpec {
    return HybridCallbackBuilder(callback: callback)
  }
}

class HybridCallbackBuilder: HybridCallbackBuilderSpec {
  private let callback: MyCallback  // ❌ BUILD FAILS HERE

  init(callback: MyCallback) {
    self.callback = callback  // ❌ Cannot store callback as property
  }

  private var message: String = "default"

  func setMessage(msg: String) throws {
    self.message = msg
  }

  func trigger() throws {
    // Create complex test data
    let complexData = ComplexData(
      url: "https://example.com/test",
      statusCode: 200,
      headers: ["Content-Type": "application/json", "X-Custom": "value"],
      metadata: ["meta1", "meta2", "meta3"]
    )

    // Create test ArrayBuffer
    let testString = "Test data here!"
    let buffer = ArrayBuffer.allocate(size: testString.utf8.count)
    testString.utf8.enumerated().forEach { (index, byte) in
      buffer.data[index] = byte
    }

    // ❌ Would call ALL callback methods with stored callback (if it compiled)
     callback.onSimpleEvent(message)
     callback.onComplexEvent(complexData)
     callback.onDataReceived(complexData, buffer)
     callback.onMaybeData(complexData)
     callback.onMultiParam(complexData, buffer, nil)
  }
}
