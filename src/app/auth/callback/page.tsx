"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a code in the URL (from magic link)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          // Exchange the code for a session (completes magic link sign-in)
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // If successful, redirect to the protected page
          if (data.session) {
            router.push("/site"); // Adjust to your desired post-login page
            return;
          }
        } else {
          // No code? Maybe the user landed here without a magic link
          throw new Error("No authentication code found in URL.");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed.");
        // Optionally redirect to home or login page on error
        setTimeout(() => router.push("/"), 3000); // Delay to show error
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ed26b] mx-auto mb-4"></div>
          <p>Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return null; // Shouldn't reach here, but just in case
}