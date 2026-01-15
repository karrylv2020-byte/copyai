import React, { useState } from 'react';
import { Transaction, Budget } from '../types';
import { EXPENSE_CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import { Pencil, Check, X, AlertCircle, AlertTriangle } from 'lucide-react';

interface BudgetViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (categoryId: string, limit: number) => void;
}

const BudgetView: React.FC<BudgetViewProps> = ({ transactions, budgets, onUpdateBudget }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<string>('');

  // Helper: Get total expense for a category in the current month
  const getSpentThisMonth = (categoryId: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.category === categoryId &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleEditClick = (categoryId: string, currentLimit: number) => {
    setEditingId(categoryId);
    setTempLimit(currentLimit > 0 ? currentLimit.toString() : '');
  };

  const handleSave = (categoryId: string) => {
    const limit = parseFloat(tempLimit);
    if (!isNaN(limit) && limit >= 0) {
      onUpdateBudget(categoryId, limit);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-200">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          本月预算管理
        </h2>
        <p className="text-blue-100 mt-2">
          为不同类别的支出设定上限，实时监控消费进度，助您达成理财目标。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPENSE_CATEGORIES.map(category => {
          const budget = budgets.find(b => b.categoryId === category.id);
          const limit = budget ? budget.limit : 0;
          const spent = getSpentThisMonth(category.id);
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;
          const isOverBudget = limit > 0 && spent > limit;
          const isNearLimit = limit > 0 && !isOverBudget && percentage >= 80;
          
          // Determine progress bar color
          let progressColor = 'bg-blue-500';
          if (isOverBudget) progressColor = 'bg-red-500';
          else if (isNearLimit) progressColor = 'bg-yellow-500';
          else progressColor = 'bg-green-500';

          const isEditing = editingId === category.id;

          return (
            <div 
              key={category.id} 
              className={`p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md relative overflow-hidden ${
                isOverBudget 
                  ? 'bg-red-50/50 border-red-200 ring-1 ring-red-100' 
                  : isNearLimit 
                    ? 'bg-yellow-50/30 border-yellow-200'
                    : 'bg-white border-gray-100'
              }`}
            >
              {isOverBudget && (
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <AlertTriangle size={80} className="text-red-500" />
                </div>
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.label.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{category.label}</h3>
                    <p className="text-xs text-gray-500">本月支出</p>
                  </div>
                </div>
                
                {!isEditing && (
                  <button 
                    onClick={() => handleEditClick(category.id, limit)}
                    className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors bg-white/50 backdrop-blur-sm"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2 mb-2 relative z-10">
                   <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{CURRENCY_SYMBOL}</span>
                      <input
                        type="number"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        placeholder="输入预算金额"
                        className="w-full pl-8 pr-3 py-2 border-2 border-blue-100 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-gray-700 bg-white/80"
                        autoFocus
                      />
                   </div>
                   <button onClick={() => handleSave(category.id)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                     <Check size={18} />
                   </button>
                   <button onClick={handleCancel} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                     <X size={18} />
                   </button>
                </div>
              ) : (
                <div className="mb-3 relative z-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                      {CURRENCY_SYMBOL}{spent.toFixed(0)}
                    </span>
                    {limit > 0 ? (
                       <span className="text-sm text-gray-400 font-medium">/ {CURRENCY_SYMBOL}{limit.toFixed(0)}</span>
                    ) : (
                       <span className="text-xs text-gray-400 ml-2 bg-gray-100 px-2 py-1 rounded-full">未设置预算</span>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {limit > 0 && (
                <div className="space-y-2 relative z-10">
                  <div className="h-2.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isOverBudget ? 'text-red-600 font-bold' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'}>
                      {percentage.toFixed(0)}%
                    </span>
                    <span className="text-gray-400">
                      {isOverBudget 
                        ? `超支 ${CURRENCY_SYMBOL}${(spent - limit).toFixed(0)}` 
                        : `剩余 ${CURRENCY_SYMBOL}${Math.max(limit - spent, 0).toFixed(0)}`
                      }
                    </span>
                  </div>
                  
                  {isOverBudget && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-2 font-bold animate-pulse bg-red-100/50 p-2 rounded-lg border border-red-200/50 w-fit">
                      <AlertCircle size={14} />
                      <span>已超出预算! 请注意控制消费。</span>
                    </div>
                  )}
                  {isNearLimit && (
                    <div className="flex items-center gap-1 text-xs text-yellow-700 mt-2 font-medium bg-yellow-100/50 p-2 rounded-lg border border-yellow-200/50 w-fit">
                      <AlertTriangle size={14} />
                      <span>接近预算上限</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetView;