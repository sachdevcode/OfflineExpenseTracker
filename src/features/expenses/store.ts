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
  loadExpenses: () => Promise<void>;
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
        console.log('Added expense, total count:', next.length);
      },
      update: async e => {
        const next = get().expenses.map(x =>
          x.id === e.id ? { ...x, ...e } : x,
        );
        set({ expenses: next });
        console.log('Updated expense, total count:', next.length);
      },
      remove: async id => {
        const next = get().expenses.filter(x => x.id !== id);
        set({ expenses: next });
        console.log('Removed expense, total count:', next.length);
      },
      clear: async () => {
        set({ expenses: [] });
        console.log('Cleared all expenses');
      },
      loadExpenses: async () => {
        try {
          const stored = await AsyncStorage.getItem('expenses.v1');
          if (stored) {
            const parsed = JSON.parse(stored);
            console.log('Loaded expenses from AsyncStorage:', parsed.state?.expenses?.length || 0);
            if (parsed.state?.expenses) {
              set({ expenses: parsed.state.expenses });
            }
          }
        } catch (error) {
          console.error('Error loading expenses:', error);
        }
      },
    }),
    {
      name: 'expenses.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ expenses: state.expenses }), // don't persist flags
      onRehydrateStorage: () => {
        console.log('Store rehydration - starting...');
        return (state) => {
          // called after rehydrate
          console.log('Store rehydration - completed, expenses count:', state?.expenses?.length || 0);
          if (state) {
            state.setHydrated(true);
            console.log('Store rehydration - hydrated flag set to true');
          }
        };
      },
    },
  ),
);

// Initialize the store on app start
const initializeStore = async () => {
  try {
    const stored = await AsyncStorage.getItem('expenses.v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Initializing store with expenses:', parsed.state?.expenses?.length || 0);
      if (parsed.state?.expenses) {
        useExpenseStore.setState({ expenses: parsed.state.expenses, hydrated: true });
      }
    } else {
      console.log('No stored expenses found, initializing with empty array');
      useExpenseStore.setState({ expenses: [], hydrated: true });
    }
  } catch (error) {
    console.error('Error initializing store:', error);
    useExpenseStore.setState({ expenses: [], hydrated: true });
  }
};

// Call initialization
initializeStore();
