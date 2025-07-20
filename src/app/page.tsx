'use client'

import { useEffect } from 'react'

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
          position: 'fixed', 
          top: '0', 
          left: '0', 
          width: '100%', 
          zIndex: 4,
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1>Kenneth&apos;s Graduation 2025</h1>
          <p>August 2nd, 2025 &nbsp;&bull;&nbsp; 9:00 AM &nbsp;&bull;&nbsp; Star Brisbane</p>
        </header>

        {/* Footer */}
        <footer id="footer">
          <span className="copyright">
            &copy; 2025 Graduation Portal. Contact: <a href="mailto:kenneth.agent.bot@gmail.com">kenneth.agent.bot@gmail.com</a>
          </span>
        </footer>
      </div>
    </div>
  )
} 