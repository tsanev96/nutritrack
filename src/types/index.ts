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
  targetWeight: number;
  weightUnit: "kg" | "lbs";
  activityLevel: ActivityLevel;
  weeklyGoal: WeeklyGoal;
};

export type BodyMeasurements = {
  neck?: number;
  waist?: number;
  hips?: number;
};

export type CheckIn = {
  /**  YYYY-MM-DD */
  date: string;
  weight?: number;
  measurements: BodyMeasurements;
};

export type DayLog = {
  breakfast: Entry[];
  lunch: Entry[];
  dinner: Entry[];
  snacks: Entry[];
  exercises: Exercise[];
};

export type TrackerState = {
  userId: string | null;
  /** date (YYYY-MM-DD) */
  logs: Record<string, DayLog>;
  macroGoals: Macros;
  microNutrientGoals: MicroNutrients;
  fitnessGoals: FitnessGoals;
  /** List of all check-ins measurements */
  checkIns: CheckIn[];
};

// The shape passed to hydrate() — everything except userId
export type HydratePayload = Omit<TrackerState, "userId">;

export type TrackerActions = {
  setUserId: (id: string | null) => void;
  hydrate: (payload: HydratePayload) => void;
  addEntry: (args: { date: string; meal: Meal; entry: Entry }) => void;
  removeEntry: (args: { date: string; meal: Meal; id: string }) => void;
  addExercise: (args: { date: string; exercise: Exercise }) => void;
  removeExercise: (args: { date: string; id: string }) => void;
  setMacroGoals: (goals: Macros) => void;
  setMicroNutrientGoals: (goals: MicroNutrients) => void;
  setFitnessGoals: (goals: FitnessGoals) => void;
  addCheckIn: (checkIn: CheckIn) => void;
};
