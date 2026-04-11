import type { StateCreator } from "zustand";

export type UserSlice = {
  userId: string | null;
  setUserId: (id: string | null) => void;
};

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
});
