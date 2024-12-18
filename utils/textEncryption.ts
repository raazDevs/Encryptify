import NodeRSA from 'node-rsa'

const key = new NodeRSA({b: 512})

export function encryptText(text: string): string {
  return key.encrypt(text, 'base64')
}

export function decryptText(encryptedText: string): string {
  return key.decrypt(encryptedText, 'utf8')
}

