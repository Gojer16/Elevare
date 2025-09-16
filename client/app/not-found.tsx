'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-violet-100 to-gray-100 text-[var(--color-foreground)]">
      <h1 className="text-3xl font-bold mb-2">404 – Page Not Found</h1>
      <p className="mb-4 opacity-70">Looks like you wandered off the path.</p>
      <Link 
        href="/dashboard" 
        className="btn bg-BrandPrimary text-white"
      >
    Back to Dashboard
      </Link>
    </main>
  );
}
