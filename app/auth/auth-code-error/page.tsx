import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd autentykacji</h2>
          <p className="text-gray-600 mb-6">
            Wystąpił problem podczas potwierdzania Twojego konta. 
            Spróbuj zalogować się ponownie lub skontaktuj się z administratorem.
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Spróbuj ponownie
            </Link>
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-900 py-2"
            >
              Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 