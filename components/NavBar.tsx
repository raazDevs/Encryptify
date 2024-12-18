import Link from 'next/link'
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Encryptify
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/rsa" passHref>
              <Button variant="ghost">RSA</Button>
            </Link>
            <Link href="/rc4" passHref>
              <Button variant="ghost">RC4</Button>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

