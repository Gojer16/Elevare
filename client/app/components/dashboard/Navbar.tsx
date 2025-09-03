"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // compute initials for fallback
  const initials = useMemo(() => {
    const name = session?.user?.name ?? "";
    if (!name) return "SL";
    return name
      .split(" ")
      .map((n) => n.at(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [session?.user?.name]);

  // Only use image src if it's non-empty string
  const imageSrc =
    typeof session?.user?.image === "string" && session.user.image.trim() !== ""
      ? session.user.image
      : null;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="inline-flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-800">Success-List</span>
              <span className="sr-only">Go to dashboard</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* show loading text while session loading */}
            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : session?.user ? (
              <>
                {/* Avatar */}
                {imageSrc ? (
                <Image
                  src={imageSrc}
                  width={48}
                  height={48}
                  alt={`${session.user.name ?? "User"}'s avatar`}
                  className="rounded-full object-cover w-12 h-12"
                  />
                  ) : (
                  <div
                    aria-label={session.user.name ?? "User"}
                    role="img"
                    className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
                  >
                  {initials}
                  </div>
                )}

                <p className="text-gray-800 mr-2 hidden sm:block">
                  Hello, {session.user.name ?? "User"}
                </p>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              // not signed in
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-md font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
