import React from 'react';
import { Zap, Clock, AlertCircle } from 'lucide-react';

function UsageHUD({ sessionUsage, walletBalance, selectedModel }) {
  if (!sessionUsage || !selectedModel) return null;

  const totalCost = sessionUsage.reduce((sum, usage) => sum + usage.cost, 0);
  const totalTokens = sessionUsage.reduce((sum, usage) => sum + usage.tokens.total, 0);

  // Progress bar for wallet balance (show remaining %)
  const initialBalance = parseFloat(walletBalance) + totalCost;
  const balancePercentage = Math.max(0, ((initialBalance - walletBalance) / initialBalance) * 100);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          Session Usage
        </h3>
        
        {/* Model Badge */}
        {selectedModel && (
          <span className="text-xs bg-stone-100 px-2 py-1 rounded font-medium">
            {getModelName(selectedModel)}
          </span>
        )}
      </div>

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Tokens Used */}
        <div className="bg-white rounded-lg p-3 border border-stone-100 text-center">
          <p className="text-xs font-medium text-stone-500 mb-1">Tokens</p>
          <p className="text-lg font-bold text-stone-800">{totalTokens.toLocaleString()}</p>
        </div>

        {/* Cost */}
        <div className="bg-white rounded-lg p-3 border border-stone-100 text-center">
          <p className="text-xs font-medium text-stone-500 mb-1">Cost</p>
          <p className="text-lg font-bold text-emerald-600">${totalCost.toFixed(4)}</p>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg p-3 border border-stone-100 text-center">
          <p className="text-xs font-medium text-stone-500 mb-1">Messages</p>
          <p className="text-lg font-bold text-stone-800">{sessionUsage.length}</p>
        </div>
      </div>

      {/* Wallet Progress */}
      {initialBalance > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-600 font-medium">Wallet</span>
            <span className={`${walletBalance < 1 ? 'text-red-600' : 'text-emerald-600'} font-bold`}>
              ${walletBalance.toFixed(2)} / ${(initialBalance).toFixed(2)}
            </span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                walletBalance < 1 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${balancePercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recent Activity Log */}
      {sessionUsage.length > 1 && (
        <div className="mt-3 pt-3 border-t border-stone-200">
          <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">Recent Calls</p>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {sessionUsage.slice(-5).reverse().map((usage, index) => (
              <div key={index} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                <span className="text-stone-600 truncate flex-1">
                  {getModelName(selectedModel)}
                </span>
                <div className="flex items-center gap-2 ml-2">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span className={`font-semibold ${usage.cost > 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${usage.cost.toFixed(4)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Balance Warning */}
      {walletBalance < 1 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">
            Low balance! Add credit to continue using the agent.
          </p>
        </div>
      )}

      {/* Price Reference */}
      {selectedModel && (
        <div className="mt-3 pt-2 border-t border-stone-100 text-xs text-stone-500">
          💡 Model price: ${MODEL_PRICING[selectedModel]?.price || 'N/A'}/M tokens
        </div>
      )}
    </div>
  );
}

// Helper function to get model name from ID
function getModelName(modelId) {
  const names = {
    'google/gemma-3-27b-it': 'Gemma 3',
    'mistralai/mistral-nemo:free': 'Mistral Nemo',
    'meta-llama/llama-3.1-8b-instruct:free': 'Llama 3.1',
    'anthropic/claude-3.5-haiku:free': 'Claude Haiku',
    'openai/gpt-4o': 'GPT-4o',
  };
  
  return names[modelId] || modelId.split('/')[1]?.replace(':free', '') || modelId;
}

// Model pricing reference (same as in openrouter.js)
const MODEL_PRICING = {
  'google/gemma-3-27b-it': 0.15,
  'mistralai/mistral-nemo:free': 0.15,
  'meta-llama/llama-3.1-8b-instruct:free': 0.25,
  'anthropic/claude-3.5-haiku:free': 1.50,
  'openai/gpt-4o': 7.50,
};

export default UsageHUD;
