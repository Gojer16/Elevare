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
import { ButtonSpinner } from "../components/UnifiedLoadingSpinner";
import { Button } from "../components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const { handleChange, handleSubmit, values, errors, isSubmitting } =
    useFormValidation({ email: "", password: "" }, validateLogin, submit);

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
      if (err instanceof Error)
        setErrorMessage(
          "Hmm, that didn’t work. Double-check your details and let’s get you back to focus."
        );
      else
        setErrorMessage(
          "Something went off track. Try again and let’s reset your focus."
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LoginAction",
              target: "https://elevareapp.vercel.app/login",
              name: "Login to Elevare",
              description:
                "Login to Elevare — the productivity and focus app inspired by The ONE Thing.",
              potentialAction: {
                "@type": "LoginAction",
                target: "https://elevareapp.vercel.app/dashboard",
              },
              agent: {
                "@type": "Person",
                name: "Elevare User",
              },
              instrument: {
                "@type": "EntryPoint",
                urlTemplate: "https://elevareapp.vercel.app/login",
                actionPlatform: [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform",
                ],
              },
              result: {
                "@type": "Person",
                name: "Elevare User",
                description:
                  "A user who has successfully logged into Elevare to enhance their productivity and focus.",
              },
              image: "https://elevareapp.vercel.app/og-image.png",
               sameAs: [
              "https://x.com/Gojer27",
              "https://github.com/Gojer16/Elevare",
              "https://www.linkedin.com/in/orlando-ascanio-dev/",
            ]
            }),
          }}
        />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-violet-50 via-white to-gray-50 text-gray-900">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {/*  Headline + Subtext */}
          <h1 className="text-3xl font-bold mb-2 text-center text-primary">
            Welcome back, let’s focus on your ONE Thing.
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Every day is a chance to do less, but better. Log in and commit to
            what truly matters today.
          </p>

          {/*  Error Message */}
          {errorMessage && (
            <p className="mb-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}

          {/*  Login Form */}
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
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
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

          {/*  Social Login Section */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-3">
              Fast track your focus, log in with your favorite account:
            </p>
            <SocialLogin />
          </div>

          {/* ✅ Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {/* <Link href="/" className="text-primary hover:underline">
              Lost your focus? Reset password here.
            </Link> */}
          </div>
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
