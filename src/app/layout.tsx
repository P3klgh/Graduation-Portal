import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Graduation Portal - RSVP Survey',
  description: 'RSVP for the graduation ceremony and stay updated with event notifications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 