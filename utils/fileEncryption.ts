import CryptoJS from 'crypto-js'

const secretKey = 'your-secret-key'

export async function encryptFile(file: File): Promise<ArrayBuffer> {
  const arrayBuffer = await file.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
  const encrypted = CryptoJS.RC4.encrypt(wordArray, secretKey)
  return encrypted.ciphertext.toArrayBuffer()
}

export async function decryptFile(encryptedFile: Blob): Promise<ArrayBuffer> {
  const arrayBuffer = await encryptedFile.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
  const decrypted = CryptoJS.RC4.decrypt({ ciphertext: wordArray }, secretKey)
  return decrypted.toArrayBuffer()
}

