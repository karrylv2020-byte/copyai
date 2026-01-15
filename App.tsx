import React, { useState, useEffect } from 'react';
import { Transaction, ViewState, Budget } from './types';
import { getStoredTransactions, saveTransactions, getStoredBudgets, saveBudgets } from './services/storageService';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import AIAdvisor from './components/AIAdvisor';
import BudgetView from './components/BudgetView';
import { LayoutDashboard, List, Sparkles, Plus, Wallet, Target } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [showForm, setShowForm] = useState<boolean>(false);

  // Load data on mount
  useEffect(() => {
    const loadedTransactions = getStoredTransactions();
    setTransactions(loadedTransactions);
    
    const loadedBudgets = getStoredBudgets();
    setBudgets(loadedBudgets);
  }, []);

  // Save transactions on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Save budgets on change
  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("确定要删除这条交易记录吗？")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateBudget = (categoryId: string, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.categoryId === categoryId);
      if (existing) {
        if (limit <= 0) {
           return prev.filter(b => b.categoryId !== categoryId);
        }
        return prev.map(b => b.categoryId === categoryId ? { ...b, limit } : b);
      } else {
        if (limit <= 0) return prev;
        return [...prev, { categoryId, limit }];
      }
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 transition-all">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-40">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">智能记账本</h1>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            仪表盘
          </button>
          <button 
            onClick={() => setView('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === 'transactions' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List size={20} />
            交易明细
          </button>
          <button 
            onClick={() => setView('budgets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === 'budgets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Target size={20} />
            预算管理
          </button>
          <button 
            onClick={() => setView('ai-insights')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === 'ai-insights' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={20} />
            AI 洞察
          </button>
        </nav>

        <div className="p-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-200 transition-transform active:scale-95"
          >
            <Plus size={20} />
            记一笔
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Wallet size={18} />
            </div>
            <h1 className="text-lg font-bold text-gray-800">智能记账本</h1>
          </div>
        </div>

        {/* View Routing */}
        {view === 'dashboard' && <Dashboard transactions={transactions} />}
        {view === 'transactions' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">交易明细</h2>
              <span className="text-gray-500 text-sm">{transactions.length} 条记录</span>
            </div>
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        )}
        {view === 'budgets' && (
          <BudgetView 
            transactions={transactions} 
            budgets={budgets} 
            onUpdateBudget={handleUpdateBudget} 
          />
        )}
        {view === 'ai-insights' && <AIAdvisor transactions={transactions} />}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setShowForm(true)}
        className="md:hidden fixed right-4 bottom-24 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-300 z-40 active:scale-90 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-40 safe-area-bottom">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${view === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button 
          onClick={() => setView('transactions')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${view === 'transactions' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <List size={24} />
          <span className="text-[10px] font-medium">明细</span>
        </button>
        <button 
          onClick={() => setView('budgets')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${view === 'budgets' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Target size={24} />
          <span className="text-[10px] font-medium">预算</span>
        </button>
        <button 
          onClick={() => setView('ai-insights')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${view === 'ai-insights' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Sparkles size={24} />
          <span className="text-[10px] font-medium">智能</span>
        </button>
      </nav>

      {/* Add Transaction Modal */}
      {showForm && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default App;