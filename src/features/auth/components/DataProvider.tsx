"use client";

// DataProvider runs once when a user logs in.
// It fetches all their data from Supabase in parallel, then hydrates each
// slice of the bound store. After that, components read from the store and
// every store action writes back to Supabase automatically.

import { useEffect, useState } from "react";
import { useAuthUser } from "./AuthProvider";
import { useStore } from "@/stores/useStore";
import { fetchAllUserData } from "@/lib/db";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function DataProvider({ children }: Props) {
  const { user } = useAuthUser();
  const setUserId = useStore((s) => s.setUserId);
  const hydrateFood = useStore((s) => s.hydrateFood);
  const hydrateExercise = useStore((s) => s.hydrateExercise);
  const hydrateWater = useStore((s) => s.hydrateWater);
  const hydrateGoals = useStore((s) => s.hydrateGoals);
  const hydrateCheckIns = useStore((s) => s.hydrateCheckIns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    fetchAllUserData(user.id)
      .then(({ foodLogs, recentFoods, exerciseLogs, waterLogs, waterGoal, macroGoals, microNutrientGoals, fitnessGoals, checkIns }) => {
        hydrateFood(foodLogs, recentFoods);
        hydrateExercise(exerciseLogs);
        hydrateWater(waterLogs, waterGoal);
        hydrateGoals(macroGoals, microNutrientGoals, fitnessGoals);
        hydrateCheckIns(checkIns);
      })
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
