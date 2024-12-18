import RSAClientWrapper from './RSAClientWrapper'

export default function RSAPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">RSA Text Encryption/Decryption</h1>
      <RSAClientWrapper />
    </div>
  )
}

