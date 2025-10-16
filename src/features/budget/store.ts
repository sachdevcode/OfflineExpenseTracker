import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Budget = {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
};

export type BudgetAlert = {
  id: string;
  budgetId: string;
  category: string;
  spent: number;
  budget: number;
  percentage: number;
  exceeded: boolean;
  createdAt: string;
};

type State = {
  budgets: Budget[];
  alerts: BudgetAlert[];
  hydrated: boolean;
};

type Actions = {
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  clearBudgets: () => Promise<void>;
  addAlert: (alert: Omit<BudgetAlert, 'id' | 'createdAt'>) => Promise<void>;
  clearAlerts: () => Promise<void>;
  setHydrated: (v: boolean) => void;
};

export const useBudgetStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      budgets: [],
      alerts: [],
      hydrated: false,
      setHydrated: v => set({ hydrated: v }),

      addBudget: async (budgetData) => {
        const newBudget: Budget = {
          ...budgetData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const next = [...get().budgets, newBudget];
        set({ budgets: next });
        console.log('Added budget:', newBudget.category, newBudget.amount);
      },

      updateBudget: async (id, budgetData) => {
        const next = get().budgets.map(budget =>
          budget.id === id 
            ? { ...budget, ...budgetData, updatedAt: new Date().toISOString() }
            : budget
        );
        set({ budgets: next });
        console.log('Updated budget:', id);
      },

      removeBudget: async (id) => {
        const next = get().budgets.filter(budget => budget.id !== id);
        set({ budgets: next });
        console.log('Removed budget:', id);
      },

      clearBudgets: async () => {
        set({ budgets: [] });
        console.log('Cleared all budgets');
      },

      addAlert: async (alertData) => {
        const newAlert: BudgetAlert = {
          ...alertData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        const next = [...get().alerts, newAlert];
        set({ alerts: next });
        console.log('Added budget alert:', newAlert.category, newAlert.percentage.toFixed(1) + '%');
      },

      clearAlerts: async () => {
        set({ alerts: [] });
        console.log('Cleared all alerts');
      },
    }),
    {
      name: 'budgets.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ budgets: state.budgets, alerts: state.alerts }),
      onRehydrateStorage: () => {
        console.log('Budget store rehydration - starting...');
        return (state) => {
          console.log('Budget store rehydration - completed, budgets count:', state?.budgets?.length || 0);
          if (state) {
            state.setHydrated(true);
            console.log('Budget store rehydration - hydrated flag set to true');
          }
        };
      },
    },
  ),
);

// Initialize the budget store on app start
const initializeBudgetStore = async () => {
  try {
    const stored = await AsyncStorage.getItem('budgets.v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Initializing budget store with budgets:', parsed.state?.budgets?.length || 0);
      if (parsed.state) {
        useBudgetStore.setState({ 
          budgets: parsed.state.budgets || [], 
          alerts: parsed.state.alerts || [],
          hydrated: true 
        });
      }
    } else {
      console.log('No stored budgets found, initializing with empty arrays');
      useBudgetStore.setState({ budgets: [], alerts: [], hydrated: true });
    }
  } catch (error) {
    console.error('Error initializing budget store:', error);
    useBudgetStore.setState({ budgets: [], alerts: [], hydrated: true });
  }
};

// Call initialization
initializeBudgetStore();
