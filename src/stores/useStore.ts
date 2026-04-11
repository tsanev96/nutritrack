import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./slices/userSlice";
import { createFoodSlice, type FoodSlice } from "./slices/foodSlice";
import { createExerciseSlice, type ExerciseSlice } from "./slices/exerciseSlice";
import { createWaterSlice, type WaterSlice } from "./slices/waterSlice";
import { createGoalsSlice, type GoalsSlice } from "./slices/goalsSlice";
import { createCheckInSlice, type CheckInSlice } from "./slices/checkInSlice";

export type BoundState = UserSlice &
  FoodSlice &
  ExerciseSlice &
  WaterSlice &
  GoalsSlice &
  CheckInSlice;

export const useStore = create<BoundState>()((...a) => ({
  ...createUserSlice(...a),
  ...createFoodSlice(...a),
  ...createExerciseSlice(...a),
  ...createWaterSlice(...a),
  ...createGoalsSlice(...a),
  ...createCheckInSlice(...a),
}));
