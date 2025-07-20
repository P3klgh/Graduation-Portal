'use client'

import { useEffect } from 'react'

export default function FontAwesomeLoader() {
  useEffect(() => {
    // Load FontAwesome CSS dynamically
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/assets/css/fontawesome-all.min.css'
    document.head.appendChild(link)

    return () => {
      // Cleanup
      document.head.removeChild(link)
    }
  }, [])

  return null
} 