import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchHealthStatus } from '../services/api';

export default function Navbar({ isOpen, setIsOpen, title }) {
  const [health, setHealth] = useState({ status: 'checking', api_key_configured: false });

  useEffect(() => {
    fetchHealthStatus().then(res => setHealth(res));
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white lg:hidden"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>{title || "Dashboard"}</span>
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            GenAI Content Studio &bull; AI-Powered Content Generation using LLMs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* API Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-300 font-medium hidden md:inline">API Status:</span>
          {health.api_key_configured ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-semibold" title="API Key missing or unconfigured">
              <AlertCircle className="w-3 h-3" /> Config Required
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
