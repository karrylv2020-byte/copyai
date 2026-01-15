import { Transaction, Budget } from '../types';

const STORAGE_KEY = 'smartledger_transactions_v1';
const BUDGET_STORAGE_KEY = 'smartledger_budgets_v1';

export const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load transactions", error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Failed to save transactions", error);
  }
};

export const getStoredBudgets = (): Budget[] => {
  try {
    const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load budgets", error);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]) => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error("Failed to save budgets", error);
  }
};