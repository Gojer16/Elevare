"use client";
import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: string) => void;
  signOut: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleLogin = async (email: string, password: string) => {
    // Assumes you have a NextAuth credentials provider set up
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result && result.error) {
      throw new Error(result.error);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      const message = (body && typeof body === 'object' && 'message' in body && typeof (body as { message?: string }).message === 'string')
        ? (body as { message: string }).message
        : undefined;
      throw new Error(message || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        login: handleLogin,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
