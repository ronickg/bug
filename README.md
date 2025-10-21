# Callback Storage Bug Reproduction

## Issue Summary

**Swift cannot store callback interfaces as properties, while Kotlin can.**

This is a minimal reproduction demonstrating a critical limitation in React Native Nitro Modules where Swift fails to compile when attempting to store callback interfaces as class properties, while Kotlin handles this pattern without issues.

## The Problem

### Callback Interface with Complex Types

```typescript
export interface ComplexData {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
  metadata: string[];
}

export interface MyCallback {
  onSimpleEvent(message: string): void;
  onComplexEvent(data: ComplexData): void;
  onDataReceived(data: ComplexData, buffer: ArrayBuffer): void;
  onMaybeData(data: ComplexData | undefined): void;
  onMultiParam(
    data: ComplexData,
    buffer: ArrayBuffer,
    optional: ComplexData | undefined
  ): void;
}
```

### What Works (Kotlin) ✅

```kotlin
import com.margelo.nitro.core.ArrayBuffer

class HybridCallbackBuilder(
  private val callback: MyCallback  // ✅ WORKS: Can store callback with complex types
) : HybridCallbackBuilderSpec() {

  override fun trigger() {
    val complexData = ComplexData(
      url = "https://example.com/test",
      statusCode = 200.0,
      headers = mapOf("Content-Type" to "application/json"),
      metadata = arrayOf("meta1", "meta2", "meta3")
    )

    val testData = "Test data here!".toByteArray()
    val buffer = ArrayBuffer.allocate(testData.size)
    val byteBuffer = buffer.getBuffer(false)
    byteBuffer.put(testData)
    byteBuffer.rewind()

    // ✅ Can call ALL callback methods with complex types
    callback.onSimpleEvent(message)
    callback.onComplexEvent(complexData)
    callback.onDataReceived(complexData, buffer)
    callback.onMaybeData(complexData)
    callback.onMultiParam(complexData, buffer, null)
  }
}
```

### What Fails (Swift) ❌

```swift
class HybridCallbackBuilder: HybridCallbackBuilderSpec {
  private let callback: MyCallback  // ❌ BUILD FAILS HERE

  init(callback: MyCallback) {
    self.callback = callback  // ❌ Cannot store callback with complex types
  }

  func trigger() throws {
    let complexData = ComplexData(url: "...", statusCode: 200, ...)
    let buffer = ArrayBuffer.allocate(size: 16)

    // ❌ Would call ALL callback methods (if it compiled)
    callback.onSimpleEvent(message)
    callback.onComplexEvent(complexData)
    callback.onDataReceived(complexData, buffer)
    callback.onMaybeData(complexData)
    callback.onMultiParam(complexData, buffer, nil)
  }
}
```

## Reproduction Steps

1. **Install dependencies:**

   ```bash
   yarn install
   cd example && yarn install && cd ..
   ```

2. **Generate Nitrogen specs:**

   ```bash
   yarn nitrogen
   ```

3. **Build the iOS app (this will fail):**

   ```bash
   cd example/ios
   pod install
   cd ..
   yarn ios
   ```

4. **Observe the Swift compilation error** when trying to store the callback property.

5. **Build the Android app (this will succeed):**
   ```bash
   yarn android
   ```

## Files Modified

### TypeScript Interface (`src/Bug.nitro.ts`)

```typescript
export interface ComplexData {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
  metadata: string[];
}

export interface MyCallback {
  onSimpleEvent(message: string): void;
  onComplexEvent(data: ComplexData): void;
  onDataReceived(data: ComplexData, buffer: ArrayBuffer): void;
  onMaybeData(data: ComplexData | undefined): void;
  onMultiParam(
    data: ComplexData,
    buffer: ArrayBuffer,
    optional: ComplexData | undefined
  ): void;
}

export interface CallbackTester extends HybridObject {
  createBuilder(callback: MyCallback): CallbackBuilder;
}

export interface CallbackBuilder extends HybridObject {
  setMessage(msg: string): void;
  trigger(): void; // Should call the stored callback with complex types
}
```

### Android Implementation

- `android/src/main/java/com/margelo/nitro/bug/Bug.kt` - CallbackTester implementation
- `android/src/main/java/com/margelo/nitro/bug/HybridCallbackBuilder.kt` - Builder that stores callback

### iOS Implementation

- `ios/Bug.swift` - Both CallbackTester and CallbackBuilder (fails to compile)

### Example App

- `example/src/App.tsx` - Simple test UI to demonstrate callback storage

## Expected Behavior

Both platforms should support storing callbacks with automatic reference counting, allowing patterns like:

- Builder patterns with deferred callback execution
- Event handlers that need to be registered and called later
- Any scenario requiring callback storage in HybridObject instances

## Actual Behavior

- ✅ **Android/Kotlin**: Compiles and runs successfully
- ❌ **iOS/Swift**: Build fails with compilation error when trying to store callback as property

## Impact

This limitation makes it impossible to implement common patterns in Swift that require deferred callback execution, creating a platform disparity in Nitro Modules capabilities.
