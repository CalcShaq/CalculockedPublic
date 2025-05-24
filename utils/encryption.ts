import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
import  {randomBytes} from 'react-native-randombytes';

// Get or create encryption key securely
export async function getEncryptionKey(): Promise<string> {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return credentials.password;
  } else {
    // Generate 256-bit key (32 bytes) and encode in hex
    const keyBytes: Uint8Array = await new Promise((resolve, reject) => {
      randomBytes(32, (err, bytes) => {
        if (err) reject(err);
        else resolve(bytes);
      });
    });
    const keyHex = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(Array.from(keyBytes)));
    await Keychain.setGenericPassword('encryptionKey', keyHex);
    return keyHex;
  }
}

export function encryptData(data: string, keyHex: string): string {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
  // Store IV with ciphertext, separated by colon
  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();
}

export function decryptData(ciphertext: string, keyHex: string): string {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const parts = ciphertext.split(':');
  if (parts.length !== 2) throw new Error('Invalid ciphertext format');
  const iv = CryptoJS.enc.Hex.parse(parts[0]);
  const encrypted = parts[1];
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
