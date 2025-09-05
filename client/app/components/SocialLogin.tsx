"use client";
import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "./ui/Button";

export default function SocialLogin() {
  const { signIn } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setError(null);
    setLoadingProvider(provider);
    try {
      await signIn(provider);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Sign in failed. Try again.");
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-center text-sm text-gray-500 mb-4">Or continue with</p>

      <div className="flex justify-center gap-4">
        <Button
          aria-label="Sign in with Google"
          variant="outline"
          onClick={() => handleSignIn("google")}
          disabled={!!loadingProvider}
        >
          <FaGoogle size={18} />
          <span className="font-medium ml-2">
            {loadingProvider === "google" ? "Signing in…" : "Google"}
          </span>
        </Button>

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