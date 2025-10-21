import { NitroModules } from 'react-native-nitro-modules';
import type { CallbackTester, MyCallback, CallbackBuilder } from './Bug.nitro';

export type { MyCallback, CallbackBuilder };

const CallbackTesterObject =
  NitroModules.createHybridObject<CallbackTester>('CallbackTester');

export function createCallbackTester(): CallbackTester {
  return CallbackTesterObject;
}
