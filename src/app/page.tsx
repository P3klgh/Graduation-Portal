'use client'

import { useEffect } from 'react'
import RSVPForm from '@/components/RSVPForm'

// Force dynamic rendering to avoid build-time data fetching
export const dynamic = 'force-dynamic'

export default function Home() {
  useEffect(() => {
    // Remove preload class when component mounts
    document.body.classList.remove('is-preload')
  }, [])

  return (
    <div id="wrapper">
      <div id="bg"></div>
      <div id="overlay"></div>
      <div id="main">
        {/* Header */}
        <header id="header" style={{ 
          position: 'relative', 
          top: '2rem', 
          zIndex: 4,
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1>Kenneth&apos;s Graduation 2025</h1>
          <p>August 2nd, 2025 &nbsp;&bull;&nbsp; 9:00 AM &nbsp;&bull;&nbsp; Star Brisbane</p>
        </header>

        {/* RSVP Form */}
        <div id="rsvp" style={{ 
          position: 'relative', 
          zIndex: 3, 
          width: '100%', 
          maxWidth: '600px', 
          margin: '0 auto 3rem auto',
          padding: '0 2rem'
        }}>
          <RSVPForm />
        </div>

        {/* Footer */}
        <footer id="footer" style={{ 
          position: 'relative', 
          bottom: '2rem', 
          zIndex: 4 
        }}>
          <span className="copyright">
            &copy; 2025 Graduation Portal. Contact: <a href="mailto:kenneth.agent.bot@gmail.com">kenneth.agent.bot@gmail.com</a>
          </span>
        </footer>
      </div>
    </div>
  )
} 