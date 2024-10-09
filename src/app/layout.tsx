'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WalletProviderComponent from '@/components/WalletProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import "@/app/globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <WalletProviderComponent>
            <Header />
            {children}
            <Footer />
          </WalletProviderComponent>
        </QueryClientProvider>
      </body>
    </html>
  )
}