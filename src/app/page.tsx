'use client'

import { useEffect } from 'react'
import RSVPForm from '@/components/RSVPForm'
import { setupRSVPSubscription, cleanupRSVPSubscription } from '@/lib/realtime-subscription'
// EmailJS is now properly configured and working

// Force dynamic rendering to avoid build-time data fetching
export const dynamic = 'force-dynamic'

export default function Home() {
  useEffect(() => {
    // Remove preload class when component mounts
    document.body.classList.remove('is-preload')
    
    // Setup real-time subscription for new RSVPs
    const subscription = setupRSVPSubscription()
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        cleanupRSVPSubscription(subscription)
      }
    }
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
          maxWidth: '500px', 
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

        {/* Portfolio Button */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          textAlign: 'center',
          marginTop: '1rem',
          flexShrink: 0,
          padding: '0.5rem 0'
        }}>
          <a 
            href="https://thekencave.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLAnchorElement
              target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              target.style.transform = 'translateY(-2px)'
              target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLAnchorElement
              target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              target.style.transform = 'translateY(0)'
              target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            🎓 View My Portfolio
          </a>
        </div>

        {/* Footer */}
        <footer id="footer" style={{ 
          position: 'relative', 
          zIndex: 10,
          marginTop: '0.5rem',
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