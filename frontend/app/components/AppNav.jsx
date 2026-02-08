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

  return (
    <nav className="flex items-center gap-2" suppressHydrationWarning>
      <a
        href="/notes"
        className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-primary-50 hover:text-primary-700"
      >
        Notes
      </a>
      <a
        href="/bookmarks"
        className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-primary-50 hover:text-primary-700"
      >
        Bookmarks
      </a>
      {mounted && user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {user.name || user.email}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-stone-200 bg-white py-1 shadow-card">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-sm font-medium text-ink hover:bg-stone-50"
              >
                Logout
              </button>
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
