import React, { useState } from 'react';
import { Transaction } from '../types';
import { ALL_CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import { Trash2, TrendingUp, TrendingDown, Search, X, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter based on search term and type
  const filteredTransactions = sortedTransactions.filter(t => {
    // 1. Filter by Type
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;

    // 2. Filter by Search Term
    if (!searchTerm.trim()) return true;
    
    const category = ALL_CATEGORIES.find(c => c.id === t.category);
    const categoryLabel = category?.label || '';
    const query = searchTerm.toLowerCase();
    
    return (
      (t.note && t.note.toLowerCase().includes(query)) ||
      categoryLabel.toLowerCase().includes(query)
    );
  });

  // Helper component to highlight matched text
  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <>{text}</>;
    
    // Split text by the highlight term (case insensitive)
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <TrendingUp size={32} />
        </div>
        <p className="text-lg font-medium">暂无交易记录</p>
        <p className="text-sm">添加您的第一笔收入或支出。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索备注或分类..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
           <button
             onClick={() => setTypeFilter('all')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               typeFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             全部
           </button>
           <button
             onClick={() => setTypeFilter('expense')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               typeFilter === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             支出
           </button>
           <button
             onClick={() => setTypeFilter('income')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               typeFilter === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             收入
           </button>
        </div>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="flex justify-center mb-2">
            <Filter size={24} className="opacity-50" />
          </div>
          <p>未找到匹配的交易记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((t) => {
            const category = ALL_CATEGORIES.find(c => c.id === t.category);
            const isExpense = t.type === 'expense';
            const categoryLabel = category?.label || '未知分类';
            
            return (
              <div 
                key={t.id} 
                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isExpense ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                    }`}
                  >
                    {isExpense ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      <HighlightText text={categoryLabel} highlight={searchTerm} />
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="shrink-0">{t.date}</span>
                      {t.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[150px] sm:max-w-[300px]">
                            <HighlightText text={t.note} highlight={searchTerm} />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 pl-2 shrink-0">
                  <span className={`font-bold text-base sm:text-lg ${isExpense ? 'text-gray-900' : 'text-green-600'}`}>
                    {isExpense ? '-' : '+'}{CURRENCY_SYMBOL}{t.amount.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="md:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="删除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;