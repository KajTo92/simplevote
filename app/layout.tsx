import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Proste Głosowanie',
  description: 'Głosowanie w czasie rzeczywistym dla spotkań, eventów i warsztatów',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 