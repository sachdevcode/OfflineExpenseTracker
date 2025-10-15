import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Expense } from './types';

type State = {
  expenses: Expense[];
  hydrated: boolean; // rehydration flag
};

type Actions = {
  add: (e: Expense) => Promise<void>;
  update: (e: Expense) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  setHydrated: (v: boolean) => void;
};

export const useExpenseStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      expenses: [],
      hydrated: false,
      setHydrated: v => set({ hydrated: v }),

      add: async e => {
        const next = [e, ...get().expenses];
        set({ expenses: next });
      },
      update: async e => {
        const next = get().expenses.map(x =>
          x.id === e.id ? { ...x, ...e } : x,
        );
        set({ expenses: next });
      },
      remove: async id => {
        const next = get().expenses.filter(x => x.id !== id);
        set({ expenses: next });
      },
      clear: async () => {
        set({ expenses: [] });
      },
    }),
    {
      name: 'expenses.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ expenses: state.expenses }), // don't persist flags
      onRehydrateStorage: () => state => {
        // called before and after rehydrate
        state?.setHydrated?.(true);
      },
    },
  ),
);
