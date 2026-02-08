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
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6" suppressHydrationWarning>
          <header className="mb-8 border-b border-stone-200 pb-6" suppressHydrationWarning>
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
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
            Built with Next.js, Tailwind CSS & Node.js/Express API.
          </footer>
        </div>
      </body>
    </html>
  );
}
