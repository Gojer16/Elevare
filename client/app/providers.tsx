"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { AuthProvider } from "../contexts/AuthContext";

type ProvidersProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
    >
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
