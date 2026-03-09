export type Meal = "breakfast" | "lunch" | "dinner" | "snacks";

export type Entry = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
};

export type DayLog = Record<Meal, Entry[]>;

export type Macros = {
  protein: number;
  carbs: number;
  fats: number;
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

export type TrackerState = {
  entries: DayLog;
  macroGoals: Macros;
  microNutrientGoals: MicroNutrients;
  fitnessGoals: FitnessGoals;
};

export type TrackerActions = {
  addEntry: (meal: Meal, entry: Entry) => void;
  removeEntry: (meal: Meal, id: string) => void;
  setMacroGoals: (goals: Macros) => void;
  setMicroNutrientGoals: (goals: MicroNutrients) => void;
  setFitnessGoals: (goals: FitnessGoals) => void;
};
