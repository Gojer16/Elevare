"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import useFormValidation from "@/app/hooks/useFormValidation";
import { validateLogin } from "@/app/lib/validation";
import SocialLogin from "../components/SocialLogin";
import { ButtonSpinner } from "../components/UnifiedLoadingSpinner";
import { Button } from "../components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [authLoaded, setAuthLoaded] = useState(false);

  // dynamically import next-auth when needed
  const [signInFn, setSignInFn] = useState<any>(null);
  const [getSessionFn, setGetSessionFn] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const mod = await import("next-auth/react");
      setSignInFn(() => mod.signIn);
      setGetSessionFn(() => mod.getSession);
      setAuthLoaded(true);
    })();
  }, []);

  const { handleChange, handleSubmit, values, errors, isSubmitting } =
    useFormValidation({ email: "", password: "" }, validateLogin, submit);

  async function submit() {
    if (!signInFn || !getSessionFn) return;

    setErrorMessage("");
    try {
      const result = await signInFn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result && result.error) throw new Error(result.error);

      await getSessionFn(); // Force session refresh
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? "Hmm, that didn’t work. Double-check your details and let’s get you back to focus."
          : "Something went off track. Try again and let’s reset your focus."
      );
    }
  }

  return (
    <>
      <Head>
        <title>
        Log in to Elevare | Focus on Your ONE Thing | Productivity App
        </title>
        <meta
          name="description"
          content="Login to Elevare, the focus and productivity app inspired by The ONE Thing. Commit to your most important task daily and track meaningful progress."
        />
        <meta
          name="keywords"
          content="login to productivity app, focus app login, task manager login, one thing method"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-violet-50 via-white to-gray-50 text-gray-900">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {/* Headline */}
          <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Welcome back, let’s focus on your ONE Thing.
          </h1>
          <p className="text-center text-gray-600 mb-6">
          Every day is a chance to do less, but better. Log in and commit to what truly matters today.
          </p>

          {/* Error */}
          {errorMessage && (
            <p className="mb-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}

          {/* Form or Skeleton */}
          {authLoaded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="••••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-3 shadow-md transition-colors flex items-center justify-center"
                >
                  {isSubmitting && <ButtonSpinner className="-ml-1 mr-3" />}
                  {isSubmitting ? "Redirecting you to clarity…" : "Focus In"}
                </Button>
              </form>
            </motion.div>
          ) : (
            // Skeleton fallback
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          )}

          {/* Social Login */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-3">
            Fast track your focus, log in with your favorite account:
            </p>
            <SocialLogin />
          </div>

          {/* Links */}
          <p className="text-center text-sm text-gray-600 mt-4">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
            Join Elevare and start building your daily ritual of clarity.
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
