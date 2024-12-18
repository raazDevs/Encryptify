import CryptoJS from 'crypto-js'

const secretKey = 'your-secret-key'

function wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < wordArray.sigBytes; i++) {
    uint8Array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return arrayBuffer;
}

export async function encryptFile(file: File): Promise<ArrayBuffer> {
  const arrayBuffer = await file.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any)
  const encrypted = CryptoJS.RC4.encrypt(wordArray, secretKey)
  return wordArrayToArrayBuffer(encrypted.ciphertext)
}

export async function decryptFile(encryptedFile: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await encryptedFile.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any)
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: wordArray })
  const decrypted = CryptoJS.RC4.decrypt(cipherParams, secretKey)
  return wordArrayToArrayBuffer(decrypted)
}

