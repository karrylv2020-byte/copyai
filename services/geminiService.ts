import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';
import { ALL_CATEGORIES } from '../constants';

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "未找到可分析的交易记录。请先添加一些收入或支出记录。";
  }

  // Prepare a summary for the AI to reduce token usage
  const summary = transactions.map(t => {
    const categoryLabel = ALL_CATEGORIES.find(c => c.id === t.category)?.label || t.category;
    const typeLabel = t.type === 'expense' ? '支出' : '收入';
    return `${t.date}: ${typeLabel} - ${categoryLabel} - 金额: ${t.amount} - 备注: ${t.note}`;
  }).join('\n');

  const prompt = `
    你是一位专业的理财顾问。请分析用户的以下交易记录。
    
    数据：
    ${summary}

    请以 Markdown 格式提供一份简明扼要的分析报告，必须包含以下内容：
    1. **消费模式**：钱主要花在哪里？有哪些不必要的开支？
    2. **收支状况**：用户的财务状况是否健康？是否在存钱？
    3. **行动建议**：针对这些具体的交易记录，提供 2-3 条切实可行的理财或省钱建议。
    
    请保持语气鼓励、专业且友好。使用列表和粗体字来提高可读性。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple analysis
      }
    });

    return response.text || "暂时无法生成分析结果。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接 AI 理财顾问时出错。请检查您的网络连接或 API 密钥。";
  }
};