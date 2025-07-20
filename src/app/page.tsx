import RSVPForm from '@/components/RSVPForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h3 mb-0">🎓 Graduation Portal</h1>
              <p className="text-muted mb-0">Class of 2024</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">
                <strong>Ceremony Date:</strong> June 15, 2024
              </p>
              <p className="text-muted mb-0">
                <strong>Location:</strong> University Graduation Hall
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-4 mb-4">Join Us for Your Special Day!</h2>
              <p className="lead mb-4">
                We&apos;re excited to celebrate your achievements! Please RSVP below to confirm your attendance 
                and receive important updates about the graduation ceremony.
              </p>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <h5>📅 Save the Date</h5>
                    <p className="text-muted">June 15, 2024 at 2:00 PM</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <h5>📍 Location</h5>
                    <p className="text-muted">University Graduation Hall</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <h5>📧 Stay Updated</h5>
                    <p className="text-muted">Get notified about important updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form */}
      <RSVPForm />

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Graduation Portal</h5>
              <p className="mb-0">Celebrating the Class of 2024</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                Questions? Contact us at{' '}
                <a href="mailto:graduation@university.edu" className="text-white">
                  graduation@university.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
} 