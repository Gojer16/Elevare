"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SocialLogin() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setError(null);
    setLoadingProvider(provider);

    try {
      // redirect: false -> return sign in result we can inspect
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/dashboard",
      } as any); // NextAuth types can be messy in client bundles; 'any' keeps it simple

      // `result` is either undefined or an object with { ok, error, url }
      if (result?.error) {
        setError(result.error);
        setLoadingProvider(null);
        return;
      }

      // successful, navigate to callbackUrl (or result.url)
      const destination = (result?.url as string) || "/dashboard";
      router.push(destination);
    } catch (err: unknown) {
      // Type-safe error handling
      if (err instanceof Error) setError(err.message);
      else setError("Sign in failed. Try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-center text-sm text-gray-500 mb-4">Or continue with</p>

      <div className="flex justify-center gap-4">
        <button
          aria-label="Sign in with Google"
          onClick={() => handleSignIn("google")}
          disabled={!!loadingProvider}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
            loadingProvider === "google"
              ? "bg-gray-200 text-gray-700 cursor-wait"
              : "bg-white text-gray-900 shadow hover:bg-gray-100"
          }`}
        >
          <FaGoogle size={18} />
          <span className="font-medium">
            {loadingProvider === "google" ? "Signing in…" : "Google"}
          </span>
        </button>

        <button
          aria-label="Sign in with GitHub"
          onClick={() => handleSignIn("github")}
          disabled={!!loadingProvider}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
            loadingProvider === "github"
              ? "bg-gray-800/60 text-white cursor-wait"
              : "bg-gray-900 text-white shadow hover:bg-gray-800"
          }`}
        >
          <FaGithub size={18} />
          <span className="font-medium">
            {loadingProvider === "github" ? "Signing in…" : "GitHub"}
          </span>
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-xs text-gray-500 max-w-prose mx-auto">
        By continuing, you agree to sign in with your selected provider. We only
        request basic profile and email permissions.
      </p>
    </div>
  );
}
