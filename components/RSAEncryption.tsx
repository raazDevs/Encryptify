'use client'

import { useState, useCallback } from 'react'
import NodeRSA from 'node-rsa'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"

export default function RSAEncryption() {
  const [key, setKey] = useState<NodeRSA | null>(null)
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [plaintext, setPlaintext] = useState('')
  const [encryptedText, setEncryptedText] = useState('')
  const [decryptedText, setDecryptedText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)

  const generateKeys = useCallback(() => {
    setIsGeneratingKeys(true)
    setError(null)
    setTimeout(() => {
      try {
        const newKey = new NodeRSA({ b: 2048 })
        setKey(newKey)
        setPublicKey(newKey.exportKey('public'))
        setPrivateKey(newKey.exportKey('private'))
      } catch (err) {
        setError('Failed to generate keys. Please try again.')
      } finally {
        setIsGeneratingKeys(false)
      }
    }, 0)
  }, [])

  const handleEncrypt = useCallback(() => {
    if (key && plaintext) {
      try {
        const encrypted = key.encrypt(plaintext, 'base64')
        setEncryptedText(encrypted)
        setError(null)
      } catch (err) {
        setError('Encryption failed. Please try again.')
      }
    } else {
      setError('Please generate keys and enter text to encrypt.')
    }
  }, [key, plaintext])

  const handleDecrypt = useCallback(() => {
    if (key && encryptedText) {
      try {
        const decrypted = key.decrypt(encryptedText, 'utf8')
        setDecryptedText(decrypted)
        setError(null)
      } catch (err) {
        setError('Decryption failed. Please check the encrypted text and try again.')
      }
    } else {
      setError('Please generate keys and enter text to decrypt.')
    }
  }, [key, encryptedText])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RSA Text Encryption/Decryption</CardTitle>
        <CardDescription>Encrypt and decrypt text using RSA algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={generateKeys} disabled={isGeneratingKeys}>
            {isGeneratingKeys ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Keys...
              </>
            ) : (
              'Generate New Keys'
            )}
          </Button>
          {key && (
            <span className="text-sm text-muted-foreground">Keys generated successfully</span>
          )}
        </div>
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          <TabsContent value="encrypt">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plaintext</label>
                <Textarea
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt"
                  rows={3}
                />
              </div>
              <Button onClick={handleEncrypt} className="w-full" disabled={!key}>Encrypt</Button>
              {encryptedText && (
                <div>
                  <label className="block text-sm font-medium mb-1">Encrypted Text</label>
                  <div className="relative">
                    <Textarea
                      value={encryptedText}
                      readOnly
                      rows={3}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1"
                      onClick={() => copyToClipboard(encryptedText)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="decrypt">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Encrypted Text</label>
                <Textarea
                  value={encryptedText}
                  onChange={(e) => setEncryptedText(e.target.value)}
                  placeholder="Enter text to decrypt"
                  rows={3}
                />
              </div>
              <Button onClick={handleDecrypt} className="w-full" disabled={!key}>Decrypt</Button>
              {decryptedText && (
                <div>
                  <label className="block text-sm font-medium mb-1">Decrypted Text</label>
                  <Textarea
                    value={decryptedText}
                    readOnly
                    rows={3}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium mb-1">Public Key</label>
            <Input value={publicKey} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Private Key</label>
            <Input value={privateKey} readOnly />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

