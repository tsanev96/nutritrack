export type Meal = "breakfast" | "lunch" | "dinner" | "snacks";

export type Entry = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type DayLog = Record<Meal, Entry[]>;

export type TrackerState = {
  entries: DayLog;
  dailyGoal: number;
};

export type TrackerActions = {
  addEntry: (meal: Meal, entry: Entry) => void;
  removeEntry: (meal: Meal, id: string) => void;
  setDailyGoal: (goal: number) => void;
};
