import type { StateCreator } from "zustand";
import type { CheckIn } from "@/types";
import { upsertCheckIn } from "@/features/checkIn/services/api";

export type CheckInSlice = {
  checkIns: CheckIn[];
  hydrateCheckIns: (checkIns: CheckIn[]) => void;
  addCheckIn: (checkIn: CheckIn) => void;
};

type WithUserId = { userId: string | null };

export const createCheckInSlice: StateCreator<
  CheckInSlice & WithUserId,
  [],
  [],
  CheckInSlice
> = (set, get) => ({
  checkIns: [],

  hydrateCheckIns: (checkIns) => set({ checkIns }),

  addCheckIn: (checkIn) => {
    set((state) => ({
      checkIns: [
        ...state.checkIns.filter((c) => c.date !== checkIn.date),
        checkIn,
      ],
    }));
    const { userId } = get();
    if (userId) upsertCheckIn(userId, checkIn);
  },
});
