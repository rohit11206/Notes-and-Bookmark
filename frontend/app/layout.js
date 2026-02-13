import { Inter } from "next/font/google";
import "./globals.css";
import AppNav from "./components/AppNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Personal Notes & Bookmark Manager",
  description: "Manage notes and bookmarks with tags and favorites",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface font-sans text-ink" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col" suppressHydrationWarning>
          <header className="border-b border-stone-200 bg-white shadow-sm" suppressHydrationWarning>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
              <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Personal Notes & Bookmark Manager
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                  Secure, tagged notes and bookmarks with favorites.
                </p>
              </div>
              <div className="flex justify-center" suppressHydrationWarning>
                <AppNav />
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              {children}
            </div>
          </main>
          <footer className="border-t border-stone-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-stone-500 sm:px-6">
              Built with Next.js, Tailwind CSS & Node.js/Express API.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
