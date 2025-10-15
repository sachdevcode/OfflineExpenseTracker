import { useEffect } from 'react';
import { useExpenseStore } from './store';
import type { Expense } from './types';
import { queryClient } from '@app/providers/QueryProvider';
import { useMutation, useQuery } from '@tanstack/react-query';

const QK = {
  all: ['expenses'] as const,
};

export const useSyncZustandToRQ = () => {
  // Keep React Query data in sync with store
  useEffect(() => {
    const unsub = useExpenseStore.subscribe(
      s => s.expenses,
      expenses => {
        queryClient.setQueryData(QK.all, expenses);
      },
      { fireImmediately: true },
    );
    return unsub;
  }, []);
};

export const useExpensesQuery = () => {
  const hydrated = useExpenseStore(s => s.hydrated);

  // Query reads from cache; hydration ensures store is ready
  return useQuery<Expense[]>({
    queryKey: QK.all,
    queryFn: async () => {
      // when there's no cache yet, pull from store
      const fromStore = useExpenseStore.getState().expenses;
      // Simulate async boundary; RQ expects a promise
      await new Promise(r => setTimeout(r, 50));
      return fromStore;
    },
    enabled: hydrated, // wait until rehydration
    initialData: () => useExpenseStore.getState().expenses,
  });
};

export const useAddExpenseMutation = () => {
  const add = useExpenseStore(s => s.add);
  return useMutation({
    mutationFn: async (e: Expense) => {
      await add(e); // store persist handles AsyncStorage
      await new Promise(r => setTimeout(r, 50)); // async simulation
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
      await new Promise(r => setTimeout(r, 50));
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
      await new Promise(r => setTimeout(r, 50));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.all });
    },
  });
};
