'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

const RC4Encryption = dynamic(() => import('@/components/RC4Encryption'), {
  loading: () => <Skeleton className="w-full h-[600px] rounded-lg" />,
  ssr: false
})

export default function RC4ClientWrapper() {
  return <RC4Encryption />
}

