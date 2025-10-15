export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO string
  note?: string;
};

export type SortKey = 'date' | 'category';
export type SortDir = 'asc' | 'desc';
