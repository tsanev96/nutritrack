import { supabase } from "@/lib/supabase";
import { CheckIn } from "@/types";

/**
 * Saves a check-in for a given date.
 * If a check-in already exists for that date, it is overwritten.
 * Unique constraint: one check-in per user per day (`user_id, date`).
 */
export async function upsertCheckIn(userId: string, checkIn: CheckIn) {
  const { error } = await supabase.from("check_ins").upsert(
    {
      user_id: userId,
      date: checkIn.date,
      weight: checkIn.weight ?? null,
      neck: checkIn.measurements.neck ?? null,
      waist: checkIn.measurements.waist ?? null,
      hips: checkIn.measurements.hips ?? null,
    },
    { onConflict: "user_id,date" },
  );
  if (error) console.error("upsertCheckIn:", error.message);
}

/**
 * Fetches all check-ins for a user (weight + body measurements per day).
 */
export async function fetchCheckIns(userId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from("check_ins")
    .select("date, weight, neck, waist, hips")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map(({ date, waist, hips, neck, weight }) => ({
    date,
    weight,
    measurements: {
      neck,
      waist,
      hips,
    },
  }));
}
