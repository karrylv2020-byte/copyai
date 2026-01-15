import { CategoryOption } from './types';

export const EXPENSE_CATEGORIES: CategoryOption[] = [
  { id: 'food', label: '餐饮美食', type: 'expense', color: '#ef4444' },
  { id: 'transport', label: '交通出行', type: 'expense', color: '#f97316' },
  { id: 'shopping', label: '购物消费', type: 'expense', color: '#eab308' },
  { id: 'housing', label: '居住/水电', type: 'expense', color: '#84cc16' },
  { id: 'entertainment', label: '休闲娱乐', type: 'expense', color: '#06b6d4' },
  { id: 'health', label: '医疗健康', type: 'expense', color: '#8b5cf6' },
  { id: 'other_expense', label: '其他支出', type: 'expense', color: '#64748b' },
];

export const INCOME_CATEGORIES: CategoryOption[] = [
  { id: 'salary', label: '工资薪酬', type: 'income', color: '#10b981' },
  { id: 'investment', label: '投资理财', type: 'income', color: '#3b82f6' },
  { id: 'gift', label: '人情红包', type: 'income', color: '#a855f7' },
  { id: 'other_income', label: '其他收入', type: 'income', color: '#6366f1' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const CURRENCY_SYMBOL = '¥'; // Or '$', '€', etc.