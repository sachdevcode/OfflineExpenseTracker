import { useEffect } from 'react';
import { useExpenseStore } from './store';
import type { Expense } from './types';
import { queryClient } from '@app/providers/QueryProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useBudgetStore } from '@features/budget/store';
import { checkBudgetViolations } from '@features/budget/utils/budgetUtils';

const QK = {
  all: ['expenses'] as const,
};

export const useSyncZustandToRQ = () => {
  // Keep React Query data in sync with store
  useEffect(() => {
    const unsub = useExpenseStore.subscribe(
      (state) => {
        console.log('Syncing to RQ - expenses count:', state.expenses.length);
        queryClient.setQueryData(QK.all, state.expenses);
      },
    );
    return unsub;
  }, []);
};

export const useExpensesQuery = () => {
  const expenses = useExpenseStore(s => s.expenses);

  // Debug logging
  console.log('useExpensesQuery - expenses count:', expenses.length);

  // Query reads from cache; store handles persistence
  return useQuery<Expense[]>({
    queryKey: QK.all,
    queryFn: async () => {
      // when there's no cache yet, pull from store
      const fromStore = useExpenseStore.getState().expenses;
      console.log('useExpensesQuery - queryFn - fromStore count:', fromStore.length);
      // Simulate async boundary; RQ expects a promise
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return fromStore;
    },
    initialData: expenses, // Use the current expenses from store
    staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
  });
};

export const useAddExpenseMutation = () => {
  const add = useExpenseStore(s => s.add);
  const addAlert = useBudgetStore(s => s.addAlert);
  const budgets = useBudgetStore(s => s.budgets);
  const expenses = useExpenseStore(s => s.expenses);

  return useMutation({
    mutationFn: async (e: Expense) => {
      await add(e); // store persist handles AsyncStorage
      
      // Check for budget violations and create alerts
      const violations = checkBudgetViolations(budgets, expenses, e);
      violations.forEach(violation => {
        addAlert(violation);
      });
      
      await new Promise<void>(resolve => setTimeout(resolve, 50)); // async simulation
      return e;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.all });
    },
  });
};

export const useUpdateExpenseMutation = () => {
  const update = useExpenseStore(s => s.update);
  return useMutation({
    mutationFn: async (e: Expense) => {
      await update(e);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return e;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.all });
    },
  });
};

export const useDeleteExpenseMutation = () => {
  const remove = useExpenseStore(s => s.remove);
  return useMutation({
    mutationFn: async (id: string) => {
      await remove(id);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.all });
    },
  });
};
