import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

export const metadata: Metadata = {
  title: 'Simple Voting / Proste Głosowanie',
  description: 'Real-time voting for meetings, events and workshops / Głosowanie w czasie rzeczywistym dla spotkań, eventów i warsztatów',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 