import { useEffect } from 'react';
import { useBudgetStore } from './store';
import { useExpenseStore } from '@features/expenses/store';
import { queryClient } from '@app/providers/QueryProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Budget, BudgetAlert } from './store';
import { checkBudgetViolations } from './utils/budgetUtils';

const QK = {
  budgets: ['budgets'] as const,
  alerts: ['budget-alerts'] as const,
};

export const useSyncBudgetToRQ = () => {
  // Keep React Query data in sync with budget store
  useEffect(() => {
    const unsub = useBudgetStore.subscribe(
      (state) => {
        console.log('Syncing budgets to RQ - budgets count:', state.budgets.length);
        queryClient.setQueryData(QK.budgets, state.budgets);
        queryClient.setQueryData(QK.alerts, state.alerts);
      },
    );
    return unsub;
  }, []);
};

export const useBudgetsQuery = () => {
  const budgets = useBudgetStore(s => s.budgets);

  return useQuery<Budget[]>({
    queryKey: QK.budgets,
    queryFn: async () => {
      const fromStore = useBudgetStore.getState().budgets;
      console.log('useBudgetsQuery - queryFn - fromStore count:', fromStore.length);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return fromStore;
    },
    initialData: budgets,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBudgetAlertsQuery = () => {
  const alerts = useBudgetStore(s => s.alerts);

  return useQuery<BudgetAlert[]>({
    queryKey: QK.alerts,
    queryFn: async () => {
      const fromStore = useBudgetStore.getState().alerts;
      console.log('useBudgetAlertsQuery - queryFn - fromStore count:', fromStore.length);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return fromStore;
    },
    initialData: alerts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddBudgetMutation = () => {
  const addBudget = useBudgetStore(s => s.addBudget);
  return useMutation({
    mutationFn: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
      await addBudget(budget);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.budgets });
    },
  });
};

export const useUpdateBudgetMutation = () => {
  const updateBudget = useBudgetStore(s => s.updateBudget);
  return useMutation({
    mutationFn: async ({ id, budget }: { id: string; budget: Partial<Budget> }) => {
      await updateBudget(id, budget);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return { id, budget };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.budgets });
    },
  });
};

export const useDeleteBudgetMutation = () => {
  const removeBudget = useBudgetStore(s => s.removeBudget);
  return useMutation({
    mutationFn: async (id: string) => {
      await removeBudget(id);
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.budgets });
    },
  });
};

export const useClearBudgetAlertsMutation = () => {
  const clearAlerts = useBudgetStore(s => s.clearAlerts);
  return useMutation({
    mutationFn: async () => {
      await clearAlerts();
      await new Promise<void>(resolve => setTimeout(resolve, 50));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.alerts });
    },
  });
};

// Hook to check budget violations when adding expenses
export const useCheckBudgetViolations = () => {
  const addAlert = useBudgetStore(s => s.addAlert);
  const budgets = useBudgetStore(s => s.budgets);
  const expenses = useExpenseStore(s => s.expenses);

  const checkViolations = (newExpense: any) => {
    const violations = checkBudgetViolations(budgets, expenses, newExpense);
    
    violations.forEach(violation => {
      addAlert(violation);
    });
    
    return violations;
  };

  return { checkViolations };
};
