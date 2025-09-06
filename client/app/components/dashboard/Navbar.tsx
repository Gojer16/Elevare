"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "../ui/Button";

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

  const imageSrc =
    typeof session?.user?.image === "string" && session.user.image.trim() !== ""
      ? session.user.image
      : null;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 group"
              title="Back to your focus ritual dashboard"
            >
              <span className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors hover:underline">Elevare</span>
              <span className="text-sm text-gray-500 italic sm:inline-block pt-1.5 sm:pt-1.5 hover:text-primary transition-colors">
                — Focus on Your ONE Thing
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session?.user ? (
              <>
                {/* Avatar */}
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    width={48}
                    height={48}
                    alt={`${session.user.name}'s avatar`}
                    className="rounded-full object-cover w-12 h-12"
                    title={`This is your focus space, ${session.user.name}.`}
                  />
                ) : (
                  <div
                    aria-label={session.user.name}
                    role="img"
                    className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
                    title={`This is your focus space, ${session.user.name}`}
                  >
                    {initials}
                  </div>
                )}

                {/* Greeting */}
                <p className="text-gray-800 mr-2 hidden sm:block">
                  Welcome back, {session.user.name}. Ready for today’s ONE Thing?
                </p>

                {/* Logout button */}
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="ml-2 bg-secondary hover:bg-secondary/70"
                  about="End your session"
                  title="See you tomorrow, success is built daily."
                >
                  End today’s session
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
