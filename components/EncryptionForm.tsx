'use client'

import { useState } from 'react'
import { encryptText, decryptText } from '@/utils/textEncryption'
import { encryptFile, decryptFile } from '@/utils/fileEncryption'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function EncryptionForm() {
  const [text, setText] = useState('')
  const [encryptedText, setEncryptedText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null)

  const handleTextEncryption = () => {
    const encrypted = encryptText(text)
    setEncryptedText(encrypted)
  }

  const handleTextDecryption = () => {
    const decrypted = decryptText(encryptedText)
    setText(decrypted)
  }

  const handleFileEncryption = async () => {
    if (file) {
      const encrypted = await encryptFile(file)
      setEncryptedFile(new Blob([encrypted]))
    }
  }

  const handleFileDecryption = async () => {
    if (encryptedFile) {
      const decrypted = await decryptFile(encryptedFile)
      setFile(new File([decrypted], 'decrypted_file'))
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Text Encryption/Decryption (RSA)</h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encrypt"
          className="mb-2"
        />
        <div className="space-x-2">
          <Button onClick={handleTextEncryption}>Encrypt</Button>
          <Button onClick={handleTextDecryption}>Decrypt</Button>
        </div>
        <Textarea
          value={encryptedText}
          readOnly
          placeholder="Encrypted text will appear here"
          className="mt-2"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">File Encryption/Decryption (RC4)</h2>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <div className="space-x-2">
          <Button onClick={handleFileEncryption}>Encrypt File</Button>
          <Button onClick={handleFileDecryption}>Decrypt File</Button>
        </div>
        {encryptedFile && (
          <a
            href={URL.createObjectURL(encryptedFile)}
            download="encrypted_file"
            className="block mt-2 text-blue-500 hover:underline"
          >
            Download Encrypted File
          </a>
        )}
      </div>
    </div>
  )
}

