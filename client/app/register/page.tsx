"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useFormValidation from "@/app/hooks/useFormValidation";
import { validateRegister } from "@/app/lib/validation";
import { signIn, getSession } from "next-auth/react";
import SocialLogin from "../components/SocialLogin";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(
    { name: "", email: "", password: "" },
    validateRegister,
    submit
  );

  async function submit() {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }

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
      if (err instanceof Error) {
        setErrorMessage("Hmm, something went off track. Let’s try again — your focus space is waiting.");
      } else {
        setErrorMessage("Hmm, something went off track. Let’s try again — your focus space is waiting.");
      }
    }
  }

  return (
    <>
      <Head>
        <title>Start your journey to focus · Elevare</title>
        <meta
          name="description"
          content="Sign up to Elevare, the focus and productivity app built on The ONE Thing method. Create your account and start your daily ritual of clarity. Keywords: signup to productivity app, create account for focus app, task manager register."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RegisterAction",
              name: "Register for Elevare",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://elevareapp.vercel.app/register",
                actionPlatform: [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform",
                ],
              },
              result: {
                "@type": "SoftwareApplication",
                name: "Elevare",
                applicationCategory: "Productivity",
                operatingSystem: "Web",
              },
              description: "Register for Elevare, the focus and productivity app built on The ONE Thing method. Create your account and start your daily ritual of clarity.",
              url: "https://elevareapp.vercel.app/register",
              image: "https://elevareapp.vercel.app/og-image.png",
               sameAs: [
              "https://x.com/Gojer27",
              "https://github.com/Gojer16/Elevare",
              "https://www.linkedin.com/in/orlando-ascanio-dev/",
            ],
              author: {
                "@type": "Person",
                name: "Orlando Ascanio",
              },
              publisher: {
                "@type": "Organization",
                name: "Elevare",
                logo: {
                  "@type": "ImageObject",
                  url: "https://elevareapp.vercel.app/logo.png",
                },
              },
              keywords: [
                "signup to productivity app",
                "create account for focus app",
                "task manager register",
              ]
            }),
          }}
        />
      </Head>

      <main className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-violet-50 via-white to-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          {/* Motivational micro-quote */}
          <p className="text-center text-sm text-gray-500 italic mb-4">
            “Today is the first step in doing less, but better.”
          </p>

          <h1 className="text-2xl font-bold text-center mb-1 text-primary">
            Start your journey to focus
          </h1>
          <p className="text-center text-gray-600 mb-2">
            Every signup is a commitment, not to do more, but to do what matters most.
          </p>
          {/* Pull-quote micro teaching moment */}
          <p className="text-center text-sm text-gray-500 mb-6">
            “Not everything matters equally. That’s why we help you choose your ONE Thing.”
          </p>

          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your name <span className="text-gray-400">(so we know who’s building clarity)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your email <span className="text-gray-400">(where your daily ritual begins)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@domain.com"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-gray-400">(the key to your focus space)</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="At least 8 characters"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 px-2 text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div>
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
                  {isSubmitting ? "Setting up your focus ritual…" : "Begin My Focus Ritual"}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Social login */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-2">
              Fast track your focus, join with one click:
            </p>
            <SocialLogin />
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already focusing with Elevare?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log back in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
