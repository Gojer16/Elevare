"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useFormValidation from "@/app/hooks/useFormValidation";
import { validateLogin } from "@/app/lib/validation";
import { signIn, getSession } from "next-auth/react";
import Head from "next/head";
import { motion } from "framer-motion";
import SocialLogin from "../components/SocialLogin";
import { Button } from "../components/ui/Button";



export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(
    { email: '', password: '' },
    validateLogin,
    submit
  );

  async function submit() {
    setErrorMessage("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result && result.error) {
        throw new Error(result.error);
      }

      await getSession(); // Force a session refresh
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Login failed. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Log in to Elevare | Focus on Your ONE Thing</title>
        <meta
          name="description"
          content="Log in to Elevare, the productivity app that helps you focus on your most important task each day and track your progress effortlessly."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-violet-50 via-white to-gray-50 text-gray-900">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-center text-primary">
            Log in to Elevare
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Stay consistent. Stay focused. Achieve more.
          </p>
          
          {/* ✅ Error Message */}
          {errorMessage && (
            <p className="mb-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}

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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
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
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                )}
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </motion.div>
          <SocialLogin />
          {/* Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link
              href="/"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
