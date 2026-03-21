import { supabase } from "@/lib/supabase";
import type { MicroNutrients } from "@/types";
import { DEFAULT_MICRO_GOALS } from "@/lib/constants";

/** The DB stores just the numbers (e.g. 20), the TypeScript type stores { value: 20, unit: "g" }.
 * So when we read from DB, we reconstruct the full typed object using defaults for units.
 */
export async function fetchMicroGoals(userId: string): Promise<MicroNutrients> {
  const { data } = await supabase
    .from("micro_nutrient_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_MICRO_GOALS;

  const {
    saturated_fat,
    polyunsaturated_fat,
    monounsaturated_fat,
    trans_fat,
    fiber,
    sugar,
    cholesterol,
    sodium,
    potassium,
    calcium,
    iron,
    vitamin_a,
    vitamin_c,
    vitamin_d,
    vitamin_e,
    vitamin_k,
  } = data;

  const d = DEFAULT_MICRO_GOALS;
  return {
    saturatedFat: {
      value: saturated_fat ?? d.saturatedFat.value,
      unit: "g",
    },
    polyunsaturatedFat: {
      value: polyunsaturated_fat ?? d.polyunsaturatedFat.value,
      unit: "g",
    },
    monounsaturatedFat: {
      value: monounsaturated_fat ?? d.monounsaturatedFat.value,
      unit: "g",
    },
    transFat: { value: trans_fat ?? d.transFat.value, unit: "g" },
    fiber: { value: fiber ?? d.fiber.value, unit: "g" },
    sugar: { value: sugar ?? d.sugar.value, unit: "g" },
    cholesterol: { value: cholesterol ?? d.cholesterol.value, unit: "mg" },
    sodium: { value: sodium ?? d.sodium.value, unit: "mg" },
    potassium: { value: potassium ?? d.potassium.value, unit: "mg" },
    calcium: { value: calcium ?? d.calcium.value, unit: "mg" },
    iron: { value: iron ?? d.iron.value, unit: "mg" },
    vitaminA: { value: vitamin_a ?? d.vitaminA.value, unit: "mcg" },
    vitaminC: { value: vitamin_c ?? d.vitaminC.value, unit: "mg" },
    vitaminD: { value: vitamin_d ?? d.vitaminD.value, unit: "mcg" },
    vitaminE: { value: vitamin_e ?? d.vitaminE.value, unit: "mg" },
    vitaminK: { value: vitamin_k ?? d.vitaminK.value, unit: "mcg" },
  };
}

export async function upsertMicroGoals(userId: string, goals: MicroNutrients) {
  const {
    calcium,
    cholesterol,
    fiber,
    iron,
    monounsaturatedFat,
    polyunsaturatedFat,
    potassium,
    saturatedFat,
    transFat,
    vitaminA,
    vitaminC,
    vitaminD,
    vitaminE,
    vitaminK,
    sugar,
    sodium,
  } = goals;
  const { error } = await supabase.from("micro_nutrient_goals").upsert(
    {
      user_id: userId,
      saturated_fat: saturatedFat.value,
      polyunsaturated_fat: polyunsaturatedFat.value,
      monounsaturated_fat: monounsaturatedFat.value,
      trans_fat: transFat.value,
      fiber: fiber.value,
      sugar: sugar.value,
      cholesterol: cholesterol.value,
      sodium: sodium.value,
      potassium: potassium.value,
      calcium: calcium.value,
      iron: iron.value,
      vitamin_a: vitaminA.value,
      vitamin_c: vitaminC.value,
      vitamin_d: vitaminD.value,
      vitamin_e: vitaminE.value,
      vitamin_k: vitaminK.value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertMicroGoals:", error.message);
}
