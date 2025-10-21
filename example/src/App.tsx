import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { useState } from 'react';
import { createCallbackTester } from 'react-native-bug';
import type { MyCallback } from 'react-native-bug';

export default function App() {
  const [lastMessage, setLastMessage] = useState<string>('No message yet');

  const testCallback = () => {
    try {
      // Create callback that updates state
      const callback: MyCallback = {
        onSimpleEvent: (message: string) => {
          console.log('onSimpleEvent:', message);
          setLastMessage(`Simple: ${message}`);
        },
        onComplexEvent: (data) => {
          console.log('onComplexEvent:', data);
          setLastMessage(`Complex: ${data.url} - ${data.statusCode}`);
        },
        onDataReceived: (data, buffer) => {
          console.log('onDataReceived:', data, buffer);
          setLastMessage(`Data received: ${buffer.byteLength} bytes`);
        },
        onMaybeData: (data) => {
          console.log('onMaybeData:', data);
          setLastMessage(data ? `Maybe: ${data.url}` : 'Maybe: undefined');
        },
        onMultiParam: (data, buffer, optional) => {
          console.log('onMultiParam:', data, buffer, optional);
          setLastMessage('All callbacks triggered successfully! ✅');
          Alert.alert('Success!', 'All complex callbacks were called!');
        },
      };

      // Create tester and builder
      const tester = createCallbackTester();
      const builder = tester.createBuilder(callback);

      // Set custom message and trigger
      builder.setMessage('Hello from callback storage test!');
      builder.trigger(); // This should call ALL the callbacks
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Callback Storage Bug Test</Text>
      <Text style={styles.subtitle}>
        ✅ Kotlin: Can store callbacks{'\n'}❌ Swift: Cannot store callbacks
      </Text>
      <Text style={styles.message}>Last message: {lastMessage}</Text>
      <Button title="Test Callback Storage" onPress={testCallback} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
