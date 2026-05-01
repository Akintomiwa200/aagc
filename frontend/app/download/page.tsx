export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
            Get the AAGC Mobile App
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--color-body)] max-w-2xl mx-auto">
            Take Apostolic Army Global Church with you wherever you go. Stay connected, access sermons, join prayers, and more.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mb-16">
          {/* iOS Download Card */}
          <div className="rounded-2xl bg-[var(--color-surface-card)] p-8 shadow-card border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-hairline-soft)]">
                <svg className="h-10 w-10 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">iOS App</h2>
              <p className="text-[var(--color-body)] mb-6">
                Download for iPhone and iPad. Requires iOS 15.0 or later.
              </p>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-body)] transition-colors duration-200"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on App Store
              </a>
            </div>
          </div>

          {/* Android Download Card */}
          <div className="rounded-2xl bg-[var(--color-surface-card)] p-8 shadow-card border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-hairline-soft)]">
                <svg className="h-10 w-10 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.341a.997.997 0 0 1-.998-.998v-4.68a.997.997 0 0 1 .998-.999.997.997 0 0 1 .999.999v4.68a.997.997 0 0 1-.999.998zm-11.046 0a.997.997 0 0 1-.999-.998v-4.68a.997.997 0 0 1 .999-.999.997.997 0 0 1 .998.999v4.68a.997.997 0 0 1-.998.998zm11.405-6.375l1.384-2.393a.288.288 0 0 0-.108-.393.288.288 0 0 0-.393.108l-1.444 2.5a6.65 6.65 0 0 0-3.172-1.142V4.998h1.5a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5h1.5v1.739a6.65 6.65 0 0 0-3.172 1.142l-1.444-2.5a.288.288 0 0 0-.393-.108.288.288 0 0 0-.108.393l1.384 2.393A6.388 6.388 0 0 0 6.488 15.1H5.75a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v1.75h.738a6.388 6.388 0 0 0 3.172 1.142v1.739a.75.75 0 0 1-1.5 0h-1.5a.75.75 0 0 1 0-1.5h1.5v-.998a6.65 6.65 0 0 0 3.172-1.142h.024a6.65 6.65 0 0 0 3.172 1.142v.998h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-1.5 0v-1.739a6.388 6.388 0 0 0 3.172-1.142h.738v-1.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-.75.75h-.738a6.388 6.388 0 0 0-3.172-1.142z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">Android App</h2>
              <p className="text-[var(--color-body)] mb-6">
                Download for Android devices. Requires Android 8.0 or later.
              </p>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-on-primary)] shadow-sm hover:bg-[var(--color-primary-active)] transition-colors duration-200"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.341a.997.997 0 0 1-.998-.998v-4.68a.997.997 0 0 1 .998-.999.997.997 0 0 1 .999.999v4.68a.997.997 0 0 1-.999.998zm-11.046 0a.997.997 0 0 1-.999-.998v-4.68a.997.997 0 0 1 .999-.999.997.997 0 0 1 .998.999v4.68a.997.997 0 0 1-.998.998zm11.405-6.375l1.384-2.393a.288.288 0 0 0-.108-.393.288.288 0 0 0-.393.108l-1.444 2.5a6.65 6.65 0 0 0-3.172-1.142V4.998h1.5a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5h1.5v1.739a6.65 6.65 0 0 0-3.172 1.142l-1.444-2.5a.288.288 0 0 0-.393-.108.288.288 0 0 0-.108.393l1.384 2.393A6.388 6.388 0 0 0 6.488 15.1H5.75a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v1.75h.738a6.388 6.388 0 0 0 3.172 1.142v1.739a.75.75 0 0 1-1.5 0h-1.5a.75.75 0 0 1 0-1.5h1.5v-.998a6.65 6.65 0 0 0 3.172-1.142h.024a6.65 6.65 0 0 0 3.172 1.142v.998h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-1.5 0v-1.739a6.388 6.388 0 0 0 3.172-1.142h.738v-1.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-.75.75h-.738a6.388 6.388 0 0 0-3.172-1.142z"/>
                </svg>
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[var(--color-ink)] mb-12">
            App Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Live Streaming',
                description: 'Watch live services and events directly from your mobile device.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Daily Devotionals',
                description: 'Start your day with inspiring devotionals and Bible readings.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                title: 'Prayer Requests',
                description: 'Submit prayer requests and join the community in prayer.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
              {
                title: 'Sermons On-Demand',
                description: 'Access our library of sermons anytime, anywhere.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
              },
              {
                title: 'Event Registration',
                description: 'Register for upcoming events and manage your calendar.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Giving & Donations',
                description: 'Support the ministry with secure online giving.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-[var(--color-surface-card)] p-6 border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all duration-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-hairline-soft)] text-[var(--color-primary)]">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-body)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="rounded-2xl bg-[var(--color-surface-card)] p-8 md:p-12 border border-[var(--color-hairline)] text-center">
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">
            Quick Download
          </h2>
          <p className="text-[var(--color-body)] mb-8 max-w-2xl mx-auto">
            Scan the QR code with your mobile device to download the app directly.
          </p>
          <div className="flex justify-center">
            <div className="h-48 w-48 rounded-xl bg-[var(--color-hairline-soft)] flex items-center justify-center">
              <svg className="h-24 w-24 text-[var(--color-muted-soft)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11V3m0 12v1m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            QR code placeholder - will be generated when app is published
          </p>
        </div>

        {/* System Requirements */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">
            System Requirements
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            <div className="rounded-lg bg-[var(--color-surface-card)] p-4 border border-[var(--color-hairline)]">
              <h3 className="font-semibold text-[var(--color-ink)] mb-2">iOS</h3>
              <p className="text-sm text-[var(--color-body)]">Requires iOS 15.0 or later. Compatible with iPhone, iPad, and iPod touch.</p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-card)] p-4 border border-[var(--color-hairline)]">
              <h3 className="font-semibold text-[var(--color-ink)] mb-2">Android</h3>
              <p className="text-sm text-[var(--color-body)]">Requires Android 8.0 or later. Works on most Android smartphones and tablets.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
