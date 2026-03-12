"use client";

// DataProvider runs once when a user logs in.
// It fetches all their data from Supabase in parallel, then
// dumps it into the Zustand store via hydrate().
// After that, the store takes over — components read from the store
// and every store action writes back to Supabase automatically.

import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/AuthProvider";
import { useTrackerStore } from "@/store/useTrackerStore";
import { fetchAllUserData } from "@/lib/db";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function DataProvider({ children }: Props) {
  const { user } = useAuthUser();
  const setUserId = useTrackerStore((s) => s.setUserId);
  const hydrate = useTrackerStore((s) => s.hydrate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    fetchAllUserData(user.id)
      .then(hydrate)
      .catch((err) => console.error("Failed to load user data:", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
