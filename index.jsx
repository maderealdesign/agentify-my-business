import React from 'react';
import { 
  Terminal, 
  Sparkles, 
  Wallet, 
  ToggleRight, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-stone-800 selection:bg-stone-200">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold italic text-lg">A</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Agentify<span className="text-stone-400 font-normal">MyBusiness</span></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="hidden md:block text-sm font-medium text-stone-500 hover:text-stone-800 transition">How it works</a>
            <button className="bg-stone-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition shadow-sm flex items-center gap-2">
              Deploy Agent <ChevronRight className="w-4 h-4" />
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
          Stop Hiring Humans.<br />
          <span className="text-stone-400">Deploy Autonomous Workers.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Automated lead generation, customer support, and business operations—without the HR headache.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button className="w-full sm:w-auto bg-stone-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-700 transition shadow-lg flex items-center justify-center gap-2">
            Get My AI Agent
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-100 py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold italic text-xs">A</span>
            </div>
            <span className="font-semibold text-stone-900">Agentify<span className="text-stone-400 font-normal">MyBusiness</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Send({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 2-7 20-4-9-9-4Z"/>
      <path d="M22 2 11 13"/>
    </svg>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LandingPage />);
