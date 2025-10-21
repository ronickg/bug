import type { HybridObject } from 'react-native-nitro-modules';

// Complex data structure similar to UrlResponseInfo
export interface ComplexData {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
  metadata: string[];
}

// Callback with COMPLEX parameter types (like UrlRequestCallback)
export interface MyCallback {
  // Simple string - should work
  onSimpleEvent(message: string): void;

  // Custom interface type
  onComplexEvent(data: ComplexData): void;

  // ArrayBuffer - complex type
  onDataReceived(data: ComplexData, buffer: ArrayBuffer): void;

  // Optional custom type
  onMaybeData(data: ComplexData | undefined): void;

  // Multiple complex params
  onMultiParam(
    data: ComplexData,
    buffer: ArrayBuffer,
    optional: ComplexData | undefined
  ): void;
}

// HybridObject that receives a callback in its builder method
export interface CallbackTester
  extends HybridObject<{ android: 'kotlin'; ios: 'swift' }> {
  // This method receives a callback and returns a builder
  createBuilder(callback: MyCallback): CallbackBuilder;
}

// Builder that should store the callback
export interface CallbackBuilder
  extends HybridObject<{ android: 'kotlin'; ios: 'swift' }> {
  setMessage(msg: string): void;
  trigger(): void; // Should call the stored callback
}
