"use client";

// AuthProvider wraps the whole app and does one job:
// - It asks Supabase "is there a logged-in user right now?"
// - If yes → show the app normally
// - If no → send the user to /auth/login
//
// It also listens for auth changes in real time (e.g. when you log out
// in another tab, this will pick that up and redirect you immediately).

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
};

const AuthContext = createContext<AuthContextValue>({ user: null });

// This hook lets any component in the app get the current user.
// e.g. const { user } = useAuthUser();
export function useAuthUser() {
  return useContext(AuthContext);
}

const PUBLIC_PATHS = ["/auth/login", "/auth/signup"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires immediately with INITIAL_SESSION, so no need for getSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!user && !isPublicPath) {
      // Not logged in and trying to access a protected page → go to login
      router.replace("/auth/login");
    } else if (user && isPublicPath) {
      // Already logged in but on login/signup page → go to home
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  const value = useMemo(() => ({ user }), [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render the app until we know auth state is settled
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  if (!user && !isPublicPath) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
