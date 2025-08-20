import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeContext'
import { UsernameProvider } from '@/components/UsernameContext'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TAAI Agent',
  description: 'AI-powered technical analysis assistant',
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
      <body className={inter.className}>
        <ThemeProvider>
          <UsernameProvider>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </UsernameProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
