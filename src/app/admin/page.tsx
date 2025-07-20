import Link from 'next/link'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h3 mb-0">🎓 Admin Dashboard</h1>
              <p className="text-muted mb-0">Graduation Portal Management</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link href="/" className="btn btn-outline-primary">
                ← Back to RSVP Form
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      <AdminDashboard />
    </main>
  )
} 