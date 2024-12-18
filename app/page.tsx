import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Welcome to Encryptify</h1>
      <p className="text-center text-lg mb-12 text-gray-600 dark:text-gray-300">
        Secure your data with our powerful encryption tools
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">RSA Text Encryption</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Secure your text messages using RSA algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rsa" passHref>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to RSA Encryption</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">RC4 File Encryption</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Encrypt and decrypt files using RC4 algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rc4" passHref>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Go to RC4 Encryption</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

