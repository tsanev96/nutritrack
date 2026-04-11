export type Meal = "breakfast" | "lunch" | "dinner" | "snacks";

export type Entry = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  sodium?: number;
  sugar?: number;
};

export const NUTRIENTS = [
  "calories",
  "carbs",
  "fats",
  "protein",
  "sodium",
  "sugar",
] as const;

export type Nutrient = (typeof NUTRIENTS)[number];

export type Exercise = {
  id: string;
  name: string;
  caloriesBurned: number;
  durationMinutes?: number;
};

export type Macros = {
  protein: number;
  carbs: number;
  fats: number;
  sodium?: number;
  sugar?: number;
};

export type CoreMacros = Pick<Macros, "protein" | "carbs" | "fats">;

type Grams = { value: number; unit: "g" };
type Milligrams = { value: number; unit: "mg" };
type Micrograms = { value: number; unit: "mcg" };

export type MicroNutrients = {
  saturatedFat: Grams;
  polyunsaturatedFat: Grams;
  monounsaturatedFat: Grams;
  transFat: Grams;
  fiber: Grams;
  sugar: Grams;
  cholesterol: Milligrams;
  sodium: Milligrams;
  potassium: Milligrams;
  calcium: Milligrams;
  iron: Milligrams;
  vitaminA: Micrograms;
  vitaminC: Milligrams;
  vitaminD: Micrograms;
  vitaminE: Milligrams;
  vitaminK: Micrograms;
};

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

export type WeeklyGoal = "lose" | "maintain" | "gain";

export type WEIGHT_UNITS = "kg" | "lbs";

export type FitnessGoals = {
  targetWeight?: number | null;
  weightUnit: "kg" | "lbs";
  activityLevel: ActivityLevel;
  weeklyGoal: WeeklyGoal;
};

export type BodyMeasurements = {
  neck?: number | null;
  waist?: number | null;
  hips?: number | null;
};

export type CheckIn = {
  /**  YYYY-MM-DD */
  date: string;
  weight?: number | null;
  measurements: BodyMeasurements;
};

