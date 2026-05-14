import React from 'react';
import { Cpu, Zap, Clock } from 'lucide-react';

const MODEL_CATEGORIES = {
  cheap: {
    title: '💰 Budget Models',
    description: 'Fast and affordable for everyday tasks',
    models: [
      { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', price: '$0.15/1M', speed: 'fast', recommended: true },
      { id: 'mistralai/mistral-nemo:free', name: 'Mistral Nemo', price: '$0.15/1M', speed: 'fast' },
      { id: 'microsoft/phi-4-mini-instruct:free', name: 'Phi 4 Mini', price: '$0.15/1M', speed: 'medium' },
    ]
  },
  medium: {
    title: '⚡ Balanced Models',
    description: 'Best value for complex reasoning',
    models: [
      { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', price: '$0.25/1M', speed: 'fast', recommended: true },
      { id: 'cohere/command-r-plus-08-2024', name: 'Command R+', price: '$0.60/1M', speed: 'medium' },
    ]
  },
  premium: {
    title: '🚀 Premium Models',
    description: 'Most powerful for challenging tasks',
    models: [
      { id: 'anthropic/claude-3.5-haiku:free', name: 'Claude 3.5 Haiku', price: '$1.50/1M', speed: 'fast', recommended: true },
      { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B', price: '$1.00/1M', speed: 'medium' },
      { id: 'mistralai/mistral-large-latest', name: 'Mistral Large', price: '$3.00/1M', speed: 'slow' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', price: '$7.50/1M', speed: 'fast', recommended: true },
      { id: 'anthropic/claude-3-opus:free', name: 'Claude 3 Opus', price: '$15.00/1M', speed: 'slow' },
    ]
  }
};

function ModelSelector({ selectedModel, onSelect }) {
  const [activeCategory, setActiveCategory] = React.useState('recommended');
  
  // Get all models for the "All" view
  function getAllModels() {
    return [
      ...MODEL_CATEGORIES.cheap.models,
      ...MODEL_CATEGORIES.medium.models,
      ...MODEL_CATEGORIES.premium.models
    ];
  }

  const currentModels = activeCategory === 'recommended' 
    ? MODEL_CATEGORIES.recommended?.models || getAllModels().filter(m => m.recommended)
    : activeCategory === 'all'
      ? getAllModels()
      : MODEL_CATEGORIES[activeCategory]?.models;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-stone-200">
        {Object.keys(MODEL_CATEGORIES).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
            }`}
          >
            {category === 'recommended' ? '⭐ Recommended' : 
             category === 'all' ? '📋 All Models' : 
             MODEL_CATEGORIES[category].title}
          </button>
        ))}
      </div>

      {/* Model Grid */}
      <div className="p-4">
        {currentModels && currentModels.length > 0 ? (
          <div className="space-y-2">
            {currentModels.map(model => (
              <button
                key={model.id}
                onClick={() => onSelect(model.id)}
                disabled={!selectedModel || selectedModel !== model.id}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedModel === model.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    {model.recommended && (
                      <span className="text-amber-500 text-xs font-bold bg-amber-100 px-2 py-1 rounded-full mt-1">
                        RECOMMENDED
                      </span>
                    )}
                    <div>
                      <h4 className="font-semibold text-stone-800">{model.name}</h4>
                      {selectedModel !== model.id && (
                        <p className="text-xs text-stone-500 mt-1">
                          {MODEL_CATEGORIES[activeCategory]?.description || 'Select this model'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`font-bold ${
                      selectedModel === model.id ? 'text-emerald-600' : 'text-stone-700'
                    }`}>
                      {model.price}
                    </span>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-stone-500">
                      {model.speed === 'fast' ? (
                        <Zap className="w-3 h-3 text-emerald-600" />
                      ) : model.speed === 'medium' ? (
                        <Clock className="w-3 h-3 text-amber-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-stone-500" />
                      )}
                      {model.speed.charAt(0).toUpperCase() + model.speed.slice(1)}
                    </div>
                  </div>
                </div>

                {selectedModel === model.id && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-emerald-700 flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      Selected for current session
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500">
            No models available in this category.
          </div>
        )}
      </div>

      {/* Price Info Footer */}
      {selectedModel && (
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 text-xs text-stone-600">
          💡 Prices are per 1M tokens. Your wallet balance is used for all model calls.
        </div>
      )}
    </div>
  );
}

export default ModelSelector;
