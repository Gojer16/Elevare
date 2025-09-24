"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "../contexts/AuthContext";
import { PostHogProvider } from "posthog-js/react";
import posthog from "@/lib/posthog";

type ProvidersProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchOnMount: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <AuthProvider>
          <PostHogProvider client={posthog}>
            {children}
          </PostHogProvider>
        </AuthProvider>
      </SessionProvider>

      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
