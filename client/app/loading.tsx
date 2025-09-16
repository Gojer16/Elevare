'use client';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="flex flex-col items-center gap-3">
        <FaSpinner className="animate-spin text-3xl text-[var(--color-primary)]" />
        <p className="text-sm opacity-70">Preparing your dashboard...</p>
      </div>
    </main>
  );
}
