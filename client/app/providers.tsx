"use client";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "../contexts/AuthContext";

type ProvidersProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
  // create QueryClient once per session (avoid recreating on every render)
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // tune these based on your app needs
          staleTime: 1000 * 60, // 1 minute
          retry: 1, // single retry on failure
          refetchOnWindowFocus: false, // matches your current auth behavior
          refetchOnReconnect: true,
          refetchOnMount: false,
        },
        mutations: {
          retry: false, // don't retry mutations by default — handle explicitly
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>

      {process.env.NODE_ENV !== "production" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
