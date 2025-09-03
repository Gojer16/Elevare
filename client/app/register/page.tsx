"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import  SocialLogin from "@/app/components/SocialLogin";
import { useAuth } from "@/contexts/AuthContext"; // optional, if you have it

// -------------------------
// Validation schema (Zod)
// -------------------------
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/,
        "Use at least 1 uppercase, 1 lowercase and 1 number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// -------------------------
// Register Page component
// -------------------------
export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth?.(); // optional; useAuth may or may not exist
  const authRegister = (auth && typeof auth.register === "function")
    ? (auth as { register: (email: string, password: string) => Promise<void> }).register
    : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Prefer using auth context register if implemented
      if (authRegister) {
        // Some auth contexts both create & login the user on register.
        // This call should throw on errors.
        await authRegister(data.email, data.password);
        // If it logs in automatically, push straight to dashboard:
        router.push("/dashboard");
        return;
      }

      // Fallback: call your API route /api/auth/register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      // server should respond with JSON { success: boolean, message?: string, token?: string }
      if (!res.ok) {
        // try to read error message, fallback to generic
        let body: unknown;
        try {
          body = await res.json();
        } catch {
          body = null;
        }
        const message = (body && typeof body === 'object' && 'message' in body && typeof (body as { message?: string }).message === 'string')
          ? (body as { message: string }).message
          : undefined;
        throw new Error(message || "Registration failed. Try again.");
      }

      const body = await res.json();

      // If backend issues a session cookie OR returns a token, you can route to dashboard.
      // For simple flows, send user to login with success message:
      if (body?.token) {
        // optional: store token (if using JWT auth) and route
        // localStorage.setItem('token', body.token); // if you use client storage
        router.push("/dashboard");
      } else {
        // no token issued — require email confirmation or login
        router.push("/login?registered=1");
      }
    } catch (err: unknown) {
      // type-safe error handling
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create an account · Success-List</title>
        <meta
          name="description"
          content="Create your Success-List account to start focusing on your ONE daily task. Fast sign up with email or use Google/GitHub for instant access."
        />
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
          <p className="text-center text-gray-600 mb-6">
            Start building the habit of one focused win per day. Sign up below or use one click social login.
          </p>

          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="you@domain.com"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 px-2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <p id="confirm-error" className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </button>
            </div>
          </form>

          {/* Social login */}
          <div className="mt-6">
            <SocialLogin />
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            By signing up, you agree to our{" "}
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
