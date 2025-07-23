import type { Metadata } from 'next'
import './globals.css'
import FontAwesomeLoader from '@/components/FontAwesomeLoader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Analytics } from '@vercel/analytics/react'

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Analytics />
      </body>
    </html>
  )
} 