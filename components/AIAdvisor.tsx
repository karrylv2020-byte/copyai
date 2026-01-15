import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { analyzeFinances } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface AIAdvisorProps {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');
    
    // Simulate min loading time for better UX
    const startTime = Date.now();
    
    const result = await analyzeFinances(transactions);
    
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
    }

    setAnalysis(result);
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Initial analysis if empty
  useEffect(() => {
    if (!analysis && !loading && transactions.length > 0) {
        // Optional: Auto-analyze on mount? Let's leave it manual to save tokens unless requested.
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-300" />
              AI 理财顾问
            </h2>
            <p className="text-indigo-100 mt-2 max-w-xl">
              获取由 Gemini 3 Flash 驱动的个性化见解、消费模式分析和储蓄建议。
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`
              px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all
              ${loading 
                ? 'bg-white/20 cursor-wait' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md active:scale-95'
              }
            `}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            {loading ? '分析中...' : '生成分析'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-indigo max-w-none">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-gray-900 font-bold text-lg m-0">分析结果</h3>
            <span className="text-xs text-gray-400">
              更新时间：{lastUpdated?.toLocaleTimeString()}
            </span>
          </div>
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}

      {transactions.length === 0 && !analysis && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800">
          <AlertTriangle size={24} />
          <p>请先添加一些交易记录以获取 AI 智能分析。</p>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;