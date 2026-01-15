export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  type: TransactionType;
  color: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
}

export type ViewState = 'dashboard' | 'transactions' | 'ai-insights' | 'budgets';

export interface AIAnalysisResult {
  markdown: string;
  loading: boolean;
  error: string | null;
}