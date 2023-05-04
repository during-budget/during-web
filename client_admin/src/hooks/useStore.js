import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      user: undefined,
      logIn: (_user) => set((state) => ({ ...state, user: _user })),
      logOut: (state) => set({ ...state, user: undefined }),
    }),
    { name: "user-StoreName" }
  )
);

export default useStore;
