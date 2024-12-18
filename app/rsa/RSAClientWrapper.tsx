'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

const RSAEncryption = dynamic(() => import('@/components/RSAEncryption'), {
  loading: () => <Skeleton className="w-full h-[600px] rounded-lg" />,
  ssr: false
})

export default function RSAClientWrapper() {
  return <RSAEncryption />
}

