
import type { Metadata } from 'next'
import { PT_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { app } from '../lib/firebase-client'

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
})

export const metadata: Metadata = {
  title: 'DaorsVibes - Your Music Companion',
  description: 'Tools and resources for musicians.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          ptSans.variable,
          playfairDisplay.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
