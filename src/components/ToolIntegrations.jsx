import React, { useState } from 'react';
import { Lock, Key, Terminal, Zap, MapPin, BookOpen, X, Check, Eye, EyeOff } from 'lucide-react';

const AVAILABLE_TOOLS = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect to your GitHub account for code operations, repo management, and deployment.',
    icon: Terminal,
    color: 'text-stone-800',
    bgColor: 'bg-stone-100',
    placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    helpText: 'Create a personal access token at https://github.com/settings/tokens with repo scope.',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Deploy your projects directly from the agent. Requires API key with deploy scope.',
    icon: Zap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    helpText: 'Get your Netlify API token from https://app.netlify.com/user/applications.',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create and update Notion pages, databases, and content via the agent.',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    placeholder: 'NOTION_SECRET_TOKEN',
    helpText: 'Create an integration at https://developers.notion.com/docs/create-a-notion-integration.',
  },
  {
    id: 'maps',
    name: 'Google Maps',
    description: 'Get directions, search locations, calculate routes and distances.',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    placeholder: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    helpText: 'Get your API key from https://console.cloud.google.com/apis/credentials.',
  },
];

function ToolIntegrations() {
  const [tools, setTools] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [activeTool, setActiveTool] = useState(null);

  // Load saved tools from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('agentify_tools');
    if (saved) {
      try {
        setTools(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved tools:', e);
      }
    }
  }, []);

  function handleSaveTool(toolId, apiKey) {
    // Validate API key format (basic validation)
    if (!apiKey || apiKey.length < 10) {
      alert('Please enter a valid API key');
      return;
    }

    const newTools = { ...tools, [toolId]: apiKey };
    setTools(newTools);
    
    // Save to localStorage (BYOK - we don't store on server)
    try {
      localStorage.setItem('agentify_tools', JSON.stringify(newTools));
      
      setActiveTool(toolId);
      setTimeout(() => setActiveTool(null), 2000); // Auto-hide success message
      
      console.log(`Saved ${toolId} API key (not stored on server)`);
    } catch (e) {
      alert('Failed to save API key. LocalStorage might be full.');
    }
  }

  function handleRemoveTool(toolId) {
    const newTools = { ...tools };
    delete newTools[toolId];
    setTools(newTools);
    
    try {
      localStorage.setItem('agentify_tools', JSON.stringify(newTools));
    } catch (e) {
      console.error('Error removing tool:', e);
    }
  }

  function togglePasswordVisibility(toolId) {
    setShowPasswords(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Tool Integrations (BYOK)
          </h3>
          
          {/* Security Badge */}
          <div className="text-xs bg-stone-900 px-3 py-1 rounded-full">
            🔒 Local Storage Only
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
        <p className="text-sm text-blue-800 font-medium mb-2 flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5" />
          Bring Your Own Keys (BYOK)
        </p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Your API keys are stored ONLY in your browser's local storage. We never save them on our servers. 
          This ensures maximum security and privacy for your integrations.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="p-6">
        <div className="space-y-4">
          {AVAILABLE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isConnected = !!tools[tool.id];
            const isSavingActiveTool = activeTool === tool.id;

            return (
              <div 
                key={tool.id}
                className={`rounded-xl border transition-all ${
                  isConnected 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : 'border-stone-100 hover:border-stone-300'
                }`}
              >
                {/* Tool Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-800">{tool.name}</h4>
                        {isConnected ? (
                          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          <p className="text-xs text-stone-500 line-clamp-2">{tool.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {isConnected ? (
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    ) : null}
                  </div>

                  {/* API Key Input */}
                  {!isConnected && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        {tool.name} API Key
                      </label>
                      
                      <div className="flex gap-2">
                        <input
                          type={showPasswords[tool.id] ? 'text' : 'password'}
                          placeholder={`Enter ${tool.name} API key...`}
                          value={tools[tool.id] || ''}
                          onChange={(e) => handleSaveTool(tool.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        
                        <button
                          onClick={() => togglePasswordVisibility(tool.id)}
                          className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                          title={showPasswords[tool.id] ? 'Hide' : 'Show'}
                        >
                          {showPasswords[tool.id] ? (
                            <EyeOff className="w-4 h-4 text-stone-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-stone-600" />
                          )}
                        </button>
                      </div>

                      {/* Help Text */}
                      <p className="text-xs text-stone-500">
                        💡 {tool.helpText}
                      </p>
                    </div>
                  )}

                  {/* Connected State */}
                  {isConnected && (
                    <div className="bg-emerald-100/50 rounded-lg p-3 mb-3 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <p className="text-xs text-emerald-700">
                        API key saved securely in your browser. The agent can now use {tool.name.toLowerCase()} tools.
                      </p>
                    </div>
                  )}

                  {/* Remove Button */}
                  {isConnected && (
                    <button
                      onClick={() => handleRemoveTool(tool.id)}
                      className="text-xs text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Remove connection
                    </button>
                  )}

                  {/* Success Message */}
                  {isSavingActiveTool && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {tool.name} API key saved! The agent can now use this tool.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Warning */}
        <div className="mt-6 bg-stone-50 border border-stone-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Security Note
          </p>
          <ul className="space-y-1 text-xs text-stone-600 ml-4">
            <li>• API keys are NEVER sent to our servers</li>
            <li>• Keys are stored ONLY in your browser (localStorage)</li>
            <li>• You can revoke access at any time by removing the connection</li>
            <li>• Use tokens with minimal required permissions</li>
          </ul>
        </div>

        {/* Tool Usage Tip */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
          💡 <strong>Pro tip:</strong> Once connected, the agent will automatically use these tools when appropriate. 
          Just ask: "Deploy my project to Netlify" or "Search for coffee shops near me on Maps".
        </div>
      </div>

      {/* Footer */}
      {Object.keys(tools).length > 0 && (
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200">
          <p className="text-xs text-stone-600 font-medium">
            {Object.keys(tools).length} tool{Object.keys(tools).length > 1 ? 's' : ''} connected
          </p>
        </div>
      )}
    </div>
  );
}

export default ToolIntegrations;
