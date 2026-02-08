export default function Home() {
  return (
    <div className="card mx-auto max-w-xl text-center">
      <h2 className="text-xl font-bold text-ink">Welcome</h2>
      <p className="mt-2 text-stone-600">
        Use this app to securely manage your personal notes and bookmarks. Each
        item supports tags, search, and favorites, and everything is tied to your
        authenticated account.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <a href="/register" className="btn-primary w-full sm:w-auto min-w-[200px]">
          Get Started – Register
        </a>
        <a href="/login" className="btn-secondary w-full sm:w-auto min-w-[200px]">
          Already have an account? Login
        </a>
        <a
          href="/notes"
          className="w-full min-w-[200px] rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-stone-50 sm:w-auto"
        >
          View Notes
        </a>
        <a
          href="/bookmarks"
          className="w-full min-w-[200px] rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-stone-50 sm:w-auto"
        >
          View Bookmarks
        </a>
      </div>
    </div>
  );
}
