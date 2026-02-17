"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AppNav() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="flex items-center gap-2" suppressHydrationWarning>
      <a href="/notes" className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-primary-50 hover:text-primary-700">
        Notes
      </a>
      <a href="/bookmarks" className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-primary-50 hover:text-primary-700">
        Bookmarks
      </a>
      {mounted && user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || "Profile"}
                className="h-10 w-10 rounded-full border-2 border-primary-200 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-100 text-sm font-semibold text-primary-700">
                {getInitials(user.name || user.email)}
              </div>
            )}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-stone-200 bg-white shadow-xl">
              <div className="px-4 py-3 border-b border-stone-100">
                <p className="text-sm font-semibold text-ink truncate">{user.name || "User"}</p>
                <p className="text-xs text-stone-500 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <a
                  href="/notes"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-stone-50"
                >
                  <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Notes
                </a>
                <a
                  href="/bookmarks"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-stone-50"
                >
                  <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  My Bookmarks
                </a>
              </div>
              <div className="border-t border-stone-100 py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <a href="/login" className="btn-primary rounded-lg px-4 py-2 text-sm">
          Login
        </a>
      )}
    </nav>
  );
}
