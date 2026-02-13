"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const authError = searchParams.get("error");

    if (authError) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem("token", token);

      // Optionally fetch user data
      const fetchUserData = async () => {
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (res.ok) {
            const userData = await res.json();
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      };

      fetchUserData();

      // Redirect to notes page
      router.push("/notes");
    } else {
      setError("No authentication token received.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="card mx-auto max-w-md text-center">
      {error ? (
        <>
          <div className="mb-4 text-red-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink">{error}</h2>
          <p className="mt-2 text-sm text-stone-600">Redirecting to login...</p>
        </>
      ) : (
        <>
          <div className="mb-4 text-primary-600">
            <svg
              className="mx-auto h-12 w-12 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink">Completing sign in...</h2>
          <p className="mt-2 text-sm text-stone-600">Please wait while we log you in.</p>
        </>
      )}
    </div>
  );
}
