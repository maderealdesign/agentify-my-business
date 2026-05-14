import React from 'react';
import { 
  Terminal, 
  Sparkles, 
  Wallet, 
  ToggleRight, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Cpu,
  Send
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-stone-800 selection:bg-stone-200">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold italic text-lg">H</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Hermes<span className="text-stone-400 font-normal">OS</span></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="hidden md:block text-sm font-medium text-stone-500 hover:text-stone-800 transition">How it works</a>
            <a href="#economics" className="hidden md:block text-sm font-medium text-stone-500 hover:text-stone-800 transition">Pricing</a>
            <button className="bg-stone-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition shadow-sm flex items-center gap-2">
              Launch Agent <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-medium mb-8 border border-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          The autonomous agent trend, simplified.
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-8 leading-[1.1]">
          The Hermes Agent.<br />
          <span className="text-stone-400">Without the terminal.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Running an autonomous AI agent used to require Docker, Python, and a command line. 
          We stripped all that away. Just a clean chat, your favorite models, and a toolbelt.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button className="w-full sm:w-auto bg-stone-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-700 transition shadow-lg flex items-center justify-center gap-2">
            Start Free Session
          </button>
          <button className="w-full sm:w-auto bg-white border border-stone-200 text-stone-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-50 transition flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Load £10 Wallet
          </button>
        </div>

        <p className="text-sm text-stone-400 max-w-md mx-auto">
          *The free tier is powered by community models and is <strong className="text-stone-500">heavily throttled</strong>. 
          For fast, unthrottled agentic loops using Gemini Flash or GPT-5.5, top up your wallet.
        </p>
      </section>

      {/* VISUAL MOCKUP SECTION */}
      <section className="px-6 max-w-5xl mx-auto mb-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFD] to-stone-50 rounded-3xl -z-10 transform scale-y-110 translate-y-10"></div>
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-2xl p-4 md:p-8 flex flex-col md:flex-row gap-6">
          
          {/* Chat Preview */}
          <div className="flex-1 bg-stone-50 rounded-2xl p-6 border border-stone-100 flex flex-col gap-6">
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-sm">
                <span className="text-stone-500 font-serif text-xs italic">H</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-sm text-stone-600 text-sm shadow-sm border border-stone-100">
                I'm Hermes. I've connected to your GitHub and Netlify. Ready to build?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-stone-800 px-5 py-3 rounded-2xl rounded-tr-sm text-white text-sm shadow-sm">
                Deploy the new landing page, please.
              </div>
            </div>
            
            <div className="mt-auto bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
              <span className="text-stone-400 text-sm">Message Hermes...</span>
              <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-stone-400" />
              </div>
            </div>
          </div>

          {/* Toolbelt Preview */}
          <div className="w-full md:w-64 flex flex-col gap-3">
             <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-stone-800" />
                  <span className="text-sm font-semibold text-stone-800">GitHub</span>
                </div>
                <div className="w-10 h-6 bg-stone-800 rounded-full p-1"><div className="bg-white w-4 h-4 rounded-full translate-x-4"></div></div>
             </div>
             <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm flex justify-between items-center opacity-70">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-stone-800">Netlify</span>
                </div>
                <div className="w-10 h-6 bg-stone-200 rounded-full p-1"><div className="bg-white w-4 h-4 rounded-full"></div></div>
             </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-stone-50 border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">How we made it analog.</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              You provide the destination, we provide the engine. No complex setups required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-stone-800" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">1. Select the Brain</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Choose the underlying LLM. Pick Gemini Flash for ultra-cheap, high-speed tasks, or GPT-5.5 for heavy logic. You control the cost.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <ToggleRight className="w-6 h-6 text-stone-800" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">2. Toggle the Hands</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Slide toggles to give the agent access to GitHub, Notion, or Maps. We prompt you for your API key, saving it securely on your device.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-stone-800" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">3. Let it Work</h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Type what you want. Hermes will think, plan, and execute using your connected tools. Watch the live HUD to track token usage in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ECONOMICS / THE REALITY OF AGENTS */}
      <section id="economics" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          
          <Wallet className="w-12 h-12 text-stone-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Agents burn tokens. <br/> We make it transparent.</h2>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Because autonomous agents "think" in loops, a single request can trigger 20 API calls. Free services throttle this instantly. 
            <strong className="text-white font-medium"> That's why we use the £10 Wallet.</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 text-left">
            <div className="bg-stone-800/50 p-6 rounded-2xl border border-stone-700 backdrop-blur-sm">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> The Free Tier
              </h4>
              <p className="text-sm text-stone-400">Uses free public endpoints. Good for testing, but rate limits will cause the agent to pause and think very slowly.</p>
            </div>
            <div className="bg-stone-800/50 p-6 rounded-2xl border border-stone-600 backdrop-blur-sm shadow-inner">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Wallet Loaded (£10)
              </h4>
              <p className="text-sm text-stone-400">Unlocks premium models. By selecting high-speed models like Gemini Flash, your £10 can fund thousands of agent actions.</p>
            </div>
          </div>

          <button className="bg-white text-stone-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-100 transition shadow-lg w-full sm:w-auto">
            Create Wallet & Start
          </button>
        </div>
      </section>

      {/* SECURITY / BYOK */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <ShieldCheck className="w-12 h-12 text-stone-400 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Bring Your Own Keys (BYOK)</h2>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg mb-8">
          We act as the brain, but you own the hands. Your external API keys (GitHub, Maps, Notion) are stored strictly in your browser's local storage. We never save them on our servers. You only pay us for the AI thinking.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-100 py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold italic text-xs">H</span>
            </div>
            <span className="font-semibold text-stone-900">Hermes<span className="text-stone-400 font-normal">OS</span></span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-stone-400">
            <a href="#" className="hover:text-stone-800 transition">Privacy</a>
            <a href="#" className="hover:text-stone-800 transition">Terms</a>
            <a href="#" className="hover:text-stone-800 transition">Twitter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function App() {
  return <LandingPage />;
}

export default App;
