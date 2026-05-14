import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Database, FileText, Sparkles, Clock, X } from 'lucide-react';
import { saveChatMessage, getChatHistory, saveAgentMemory, loadAgentMemory } from '../firebase';

function ChatInterface({ onSendMessage, selectedModel }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [memoryFiles, setMemoryFiles] = useState([]);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadChatHistory() {
    try {
      const history = await getChatHistory('current-user-id', 50); // Will use real user ID later
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    setInputValue('');
    setLoading(true);

    // Add user message to UI immediately
    const newMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Save to Firebase
      await saveChatMessage('current-user-id', newMessage.id, 'user', userMessage);

      // Simulate agent response (will replace with real OpenRouter call)
      setTimeout(async () => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateMockResponse(userMessage),
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Save to Firebase
        await saveChatMessage('current-user-id', assistantMessage.id, 'assistant', assistantMessage.content);
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      // Remove the temporary message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function generateMockResponse(input) {
    const responses = [
      "I'm analyzing your request and will get back to you shortly. This is a mock response while we integrate OpenRouter.",
      "That's an interesting question! Let me think about this... *agent thinking* Based on my analysis, I recommend exploring multiple approaches.",
      "I've connected to your tools. What would you like me to do next? I can help with GitHub operations, Notion updates, or research tasks.",
      "Processing your request through the selected model. This demonstrates how our agent will work once fully integrated."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async function handleMemoryFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      
      // Save to Firebase
      const fileName = file.name.replace('.md', '');
      await saveAgentMemory('current-user-id', fileName, content);
      
      // Update local state
      setMemoryFiles(prev => [...prev, { name: fileName, updatedAt: new Date() }]);
      
      alert(`Saved "${fileName}" to agent memory!`);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    }
  }

  async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async function loadMemoryFile(fileName) {
    try {
      const content = await loadAgentMemory('current-user-id', fileName);
      
      if (content) {
        setInputValue(prev => prev + `\n\n[Context from ${fileName}:\n${content}]`);
        setShowMemoryPanel(false);
      } else {
        alert(`File "${fileName}" not found.`);
      }
    } catch (error) {
      console.error('Error loading memory file:', error);
      alert('Failed to load file.');
    }
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
        {/* Messages Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Hermes Agent Chat
            </h2>
            {selectedModel && (
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Model: {selectedModel.split('/')[1]?.replace(':free', '') || selectedModel}
              </span>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Start a conversation with Hermes</p>
              <p className="text-sm mt-1">Ask questions, request tasks, or explore what the agent can do.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-xs italic">H</span>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.timestamp && (
                    <div className={`flex items-center gap-1 mt-2 text-xs ${
                      message.role === 'user' ? 'text-emerald-200' : 'text-stone-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {new Date(message.timestamp.seconds * 1000).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                    <span className="text-stone-600 font-bold text-xs">U</span>
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-emerald-600 font-bold text-xs italic">H</span>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="border-t border-stone-200 p-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Hermes to do something..."
              disabled={loading || !selectedModel}
              className="flex-1 px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-100"
            />
            
            <button
              type="submit"
              disabled={loading || !inputValue.trim() || !selectedModel}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                loading || !inputValue.trim() || !selectedModel
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {!selectedModel && (
            <p className="text-xs text-stone-500 mt-2">
              ⚠️ Please select a model first to start chatting with the agent.
            </p>
          )}
        </form>
      </div>

      {/* Memory Panel (Toggleable) */}
      {showMemoryPanel && (
        <div className="w-80 bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden ml-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-white flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" />
              Agent Memory
            </h3>
            <button
              onClick={() => setShowMemoryPanel(false)}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {/* File Upload */}
            <label className="block mb-4">
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleMemoryFileUpload}
                className="hidden"
                id="memory-upload"
              />
              <button
                htmlFor="memory-upload"
                className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Paperclip className="w-4 h-4" />
                Upload MD File
              </button>
            </label>

            {/* Saved Files */}
            {memoryFiles.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Saved Context</p>
                {memoryFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => loadMemoryFile(file.name)}
                    className="w-full flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700 truncate">{file.name}.md</p>
                      <p className="text-xs text-stone-500">
                        {new Date(file.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No saved memory files yet.</p>
                <p className="text-xs mt-1">Upload MD files to give your agent context about projects, preferences, and history.</p>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-700">
              <p className="font-semibold mb-1">💡 How it works:</p>
              <ul className="space-y-1 ml-4">
                <li>• Upload MD files with project details</li>
                <li>• Your agent remembers context across sessions</li>
                <li>• Files are stored securely in Firebase</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Memory Button */}
      {!showMemoryPanel && (
        <button
          onClick={() => setShowMemoryPanel(true)}
          className="self-start px-4 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          <Database className="w-5 h-5" />
          Memory
        </button>
      )}
    </div>
  );
}

export default ChatInterface;
