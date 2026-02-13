export default function Home() {
  return (
    <>
      {/* Hero Section - Full Width */}
      <div className="-mx-4 sm:-mx-6 -mt-8 mb-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 px-6 py-24 sm:px-12 sm:py-32">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white blur-3xl"></div>
          </div>
          
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to Your Digital Brain
            </h2>
            <p className="mt-6 text-lg leading-8 text-orange-50 sm:text-xl">
              Capture ideas, save resources, and organize your digital life. 
              Everything you need, beautifully organized and instantly searchable.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary-600 shadow-lg hover:bg-orange-50 hover:shadow-xl transition-all duration-200"
              >
                Get Started Free
              </a>
              <a 
                href="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-ink sm:text-3xl">Everything You Need</h3>
          <p className="mt-2 text-stone-600">Powerful features to organize your digital world</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Quick Notes</h4>
            <p className="mt-2 text-sm text-stone-600">
              Capture thoughts instantly with our lightning-fast note editor. Rich text, tags, and search built in.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Smart Bookmarks</h4>
            <p className="mt-2 text-sm text-stone-600">
              Save and organize your favorite websites. Tag, search, and access them from anywhere.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Flexible Tags</h4>
            <p className="mt-2 text-sm text-stone-600">
              Organize with tags that make sense to you. Create your own system, find anything instantly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Powerful Search</h4>
            <p className="mt-2 text-sm text-stone-600">
              Find what you need in seconds. Search across all your notes and bookmarks effortlessly.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Favorites</h4>
            <p className="mt-2 text-sm text-stone-600">
              Mark your most important items as favorites for quick access whenever you need them.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card group hover:shadow-card-hover transition-shadow duration-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-ink">Secure & Private</h4>
            <p className="mt-2 text-sm text-stone-600">
              Your data is encrypted and tied to your account. Only you have access to your notes and bookmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access CTA Section */}
      <div className="card border-2 border-primary-200 bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">Try It Out</h3>
          <p className="mt-2 text-stone-600">
            Browse public notes and bookmarks, or create your account to start organizing.
          </p>
          
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/notes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-6 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Browse Notes
            </a>
            <a
              href="/bookmarks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-6 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Browse Bookmarks
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
