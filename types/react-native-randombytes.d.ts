declare module 'react-native-randombytes' {
  export function randomBytes(size: number, callback: (err: Error | null, bytes: Uint8Array) => void): void;
}
