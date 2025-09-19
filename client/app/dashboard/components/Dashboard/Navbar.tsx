'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Compute initials for fallback
  const initials = useMemo(() => {
    const name = session?.user?.name ?? '';
    if (!name) return 'SL';
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [session?.user?.name]);

  const imageSrc =
    typeof session?.user?.image === 'string' && session.user.image.trim() !== ''
      ? session.user.image
      : null;

  // Rotating motivational greetings
  const greetings = useMemo(() => [
    "Ready to focus?",
    "Let’s keep your streak alive!",
    "One small step at a time 💪",
    "Success is built daily.",
    "Stay present. Stay sharp."
  ], []);
  const [greeting, setGreeting] = useState(greetings[0]);

  useEffect(() => {
    if (session?.user) {
      const random = greetings[Math.floor(Math.random() * greetings.length)];
      setGreeting(random);
    }
  }, [session?.user, greetings]);

  return (
    <nav
      role="navigation"
      className="bg-background border-b border-gray-200 dark:border-gray-700"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand — always visible on mobile */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 group"
              title="Back to your focus ritual dashboard"
            >
              <span className="text-2xl font-bold text-[var(--color-foreground)] hover:text-primary transition-colors hover:underline">
              Elevare
              </span>
              <span className="text-sm italic sm:inline-block pt-1.5 sm:pt-1.5 text-[var(--color-foreground)] opacity-70 group-hover:text-primary transition-colors">
              — Focus on Your ONE Thing
              </span>
            </Link>
          </div>

          {/* Spacer for alignment */}
          <div className="flex-1"></div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="hidden md:block w-40 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            ) : session?.user ? (
              <>
                {/* Avatar */}
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    width={40}
                    height={40}
                    alt={`${session.user.name}'s avatar`}
                    className="rounded-full object-cover w-10 h-10"
                    title={`This is your focus space, ${session.user.name}.`}
                  />
                ) : (
                  <div
                    aria-label={session.user.name || 'User avatar'}
                    role="img"
                    className="w-10 h-10 rounded-full bg-BrandPrimary text-white flex items-center justify-center font-semibold"
                    title={`This is your focus space, ${session.user.name}`}
                  >
                    {initials}
                  </div>
                )}

                {/* Greeting */}
                <p className="hidden md:block text-[var(--color-foreground)]">
                Welcome back, {session.user.name}. {greeting}
                </p>

                {/* Desktop logout */}
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  aria-label="Logout of Elevare"
                  className="hidden sm:inline-flex ml-2 bg-BrandSecondary text-white hover:bg-BrandSecondary/90"
                  title="See you tomorrow, success is built daily."
                >
                End Session
                </Button>

                {/* Mobile hamburger menu */}
                <div className="sm:hidden">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    aria-label="Logout of Elevare"
                    className="p-2 rounded-md text-[var(--color-foreground)] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                  <Menu className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
