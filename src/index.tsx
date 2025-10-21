import { NitroModules } from 'react-native-nitro-modules';
import type { Bug } from './Bug.nitro';

const BugHybridObject =
  NitroModules.createHybridObject<Bug>('Bug');

export function multiply(a: number, b: number): number {
  return BugHybridObject.multiply(a, b);
}
