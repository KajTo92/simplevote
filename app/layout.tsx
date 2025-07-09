import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/components/LanguageProvider'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'TeamVote – Live Office Polling App for Teams | QR Voting, Bar Charts, Employee Engagement',
  description: 'TeamVote: Real-time office polling app for team meetings and employee engagement. QR code voting, live bar charts, instant results. Perfect for corporate events and workshops.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
            <Navbar />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 