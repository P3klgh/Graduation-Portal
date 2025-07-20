import type { Metadata } from 'next'
import './globals.css'
import FontAwesomeLoader from '@/components/FontAwesomeLoader'

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
      <body className="is-preload">
        <FontAwesomeLoader />
        {children}
      </body>
    </html>
  )
} 