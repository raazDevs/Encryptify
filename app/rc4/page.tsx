import RC4ClientWrapper from "./RC4ClientWrapper"

export default function RC4Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">RC4 File Encryption/Decryption</h1>
      <RC4ClientWrapper />
    </div>
  )
}

