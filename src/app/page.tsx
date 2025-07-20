'use client'

import { useEffect } from 'react'
import RSVPForm from '@/components/RSVPForm'

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
        <header id="header">
          <h1>🎓 Graduation 2025</h1>
          <p>August 2nd, 2025 &nbsp;&bull;&nbsp; 9:00 AM &nbsp;&bull;&nbsp; Star Brisbane</p>
          <nav>
            <ul>
              <li><a href="#rsvp" className="icon solid fa-calendar-check"><span className="label">RSVP</span></a></li>
              <li><a href="mailto:graduation@starbrisbane.com" className="icon solid fa-envelope"><span className="label">Email</span></a></li>
              <li><a href="tel:+61730000000" className="icon solid fa-phone"><span className="label">Phone</span></a></li>
              <li><a href="/admin" className="icon solid fa-cog"><span className="label">Admin</span></a></li>
            </ul>
          </nav>
        </header>

        {/* RSVP Form */}
        <div id="rsvp" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, width: '100%', maxWidth: '500px', padding: '0 2rem' }}>
          <RSVPForm />
        </div>

        {/* Footer */}
        <footer id="footer">
          <span className="copyright">
            &copy; 2025 Graduation Portal. Contact: <a href="mailto:graduation@starbrisbane.com">graduation@starbrisbane.com</a>
          </span>
        </footer>
      </div>
    </div>
  )
} 