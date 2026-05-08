import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import PwaSetup from '@/components/PwaSetup'

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Campus – Issue Reporting System',
  description: 'Digital Maintenance Solution with Geo-Fencing for Campus Issue Reporting',
  keywords: ['campus', 'issue reporting', 'maintenance', 'university', 'geo-fencing'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Smart Campus',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-gray-100 min-h-screen font-sans`}>
        <AuthProvider>
          {/* Phone frame wrapper */}
          <div className="flex items-start justify-center min-h-screen">
            <div className="relative w-full max-w-[390px] min-h-screen bg-gray-50 shadow-2xl overflow-hidden">
              {children}
            </div>
          </div>
          <Toaster position="top-center" richColors />
        </AuthProvider>
        <PwaSetup />
      </body>
    </html>
  )
}
