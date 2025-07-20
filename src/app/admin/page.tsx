'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
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
          <h1>🎓 Admin Dashboard</h1>
          <p>Graduation Portal Management &nbsp;&bull;&nbsp; RSVP Management</p>
          <nav>
            <ul>
              <li><Link href="/" className="icon solid fa-home"><span className="label">Home</span></Link></li>
              <li><a href="mailto:graduation@starbrisbane.com" className="icon solid fa-envelope"><span className="label">Email</span></a></li>
              <li><a href="tel:+61730000000" className="icon solid fa-phone"><span className="label">Phone</span></a></li>
            </ul>
          </nav>
        </header>

        {/* Admin Dashboard */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, width: '100%', maxWidth: '1200px', padding: '0 2rem' }}>
          <AdminDashboard />
        </div>

        {/* Footer */}
        <footer id="footer">
          <span className="copyright">
            &copy; 2025 Graduation Portal Admin. <Link href="/">← Back to RSVP Form</Link>
          </span>
        </footer>
      </div>
    </div>
  )
} 