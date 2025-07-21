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
      <div id="main" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '1rem 0',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <header id="header" style={{ 
          position: 'relative', 
          zIndex: 10,
          textAlign: 'center',
          marginBottom: '0.5rem',
          padding: '0.5rem 0',
          flexShrink: 0
        }}>
          <h1>Kenneth&apos;s Graduation 2025</h1>
          <p>August 2nd, 2025 &nbsp;&bull;&nbsp; 9:00 AM &nbsp;&bull;&nbsp; Star Brisbane</p>
        </header>

        {/* RSVP Form */}
        <div id="rsvp" style={{ 
          position: 'relative', 
          zIndex: 5, 
          width: '100%', 
          maxWidth: '600px', 
          margin: '0 auto',
          padding: '0 1rem',
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '0',
          overflow: 'auto'
        }}>
          <RSVPForm />
        </div>

        {/* Footer */}
        <footer id="footer" style={{ 
          position: 'relative', 
          zIndex: 10,
          marginTop: '1rem',
          flexShrink: 0,
          textAlign: 'center',
          padding: '0.5rem 0'
        }}>
          <span className="copyright">
            &copy; 2025 Graduation Portal. Contact: <a href="mailto:kenneth.agent.bot@gmail.com">kenneth.agent.bot@gmail.com</a>
          </span>
        </footer>
      </div>
    </div>
  )
} 