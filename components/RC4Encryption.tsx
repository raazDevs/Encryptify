'use client'

import { useState, useRef, useCallback } from 'react'
import CryptoJS from 'crypto-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function arrayBufferToWordArray(ab: ArrayBuffer) {
  const i8a = new Uint8Array(ab)
  const a = []
  for (let i = 0; i < i8a.length; i += 4) {
    a.push((i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3])
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length)
}

function wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray) {
  const length = wordArray.sigBytes
  const array = new ArrayBuffer(length)
  const uint8Array = new Uint8Array(array)
  for (let i = 0; i < length; i++) {
    uint8Array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
  }
  return array
}

export default function RC4Encryption() {
  const [file, setFile] = useState<File | null>(null)
  const [key, setKey] = useState('')
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null)
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setEncryptedFile(null)
      setDecryptedFile(null)
      setError(null)
    }
  }, [])

  const processFile = useCallback(async (action: 'encrypt' | 'decrypt') => {
    if (!file || !key) {
      setError(`Please select a file and enter an ${action}ion key.`)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const wordArray = arrayBufferToWordArray(arrayBuffer)

      let resultWordArray: CryptoJS.lib.WordArray
      if (action === 'encrypt') {
        resultWordArray = CryptoJS.RC4.encrypt(wordArray, key).ciphertext
      } else {
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: wordArray })
        resultWordArray = CryptoJS.RC4.decrypt(cipherParams, key)
      }

      const resultArrayBuffer = wordArrayToArrayBuffer(resultWordArray)
      const blob = new Blob([resultArrayBuffer], { type: action === 'encrypt' ? 'application/octet-stream' : file.type })

      if (action === 'encrypt') {
        setEncryptedFile(blob)
      } else {
        setDecryptedFile(blob)
      }
    } catch (err) {
      setError(`${action.charAt(0).toUpperCase() + action.slice(1)}ion failed. Please try again.`)
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }, [file, key])

  const encryptFile = useCallback(() => processFile('encrypt'), [processFile])
  const decryptFile = useCallback(() => processFile('decrypt'), [processFile])

  const downloadFile = useCallback((blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RC4 File Encryption/Decryption</CardTitle>
        <CardDescription>Encrypt and decrypt files using RC4 algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium mb-1">
            Upload File
          </label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mb-2"
          />
          {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
        </div>
        <div>
          <label htmlFor="encryption-key" className="block text-sm font-medium mb-1">
            Encryption/Decryption Key
          </label>
          <Input
            id="encryption-key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter encryption/decryption key"
            className="mb-2"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          <TabsContent value="encrypt">
            <div className="space-y-4">
              <Button onClick={encryptFile} disabled={!file || !key || isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  'Encrypt File'
                )}
              </Button>
              {encryptedFile && (
                <Button
                  onClick={() => downloadFile(encryptedFile, `encrypted_${file?.name}`)}
                  className="w-full"
                >
                  Download Encrypted File
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="decrypt">
            <div className="space-y-4">
              <Button onClick={decryptFile} disabled={!file || !key || isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  'Decrypt File'
                )}
              </Button>
              {decryptedFile && (
                <Button
                  onClick={() => downloadFile(decryptedFile, `decrypted_${file?.name}`)}
                  className="w-full"
                >
                  Download Decrypted File
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

