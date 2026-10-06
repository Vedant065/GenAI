import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Cpu, Database, Server, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { fetchHealthStatus } from '../services/api';

export default function SettingsPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthStatus().then(res => {
      setHealth(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Status</h1>
          <p className="text-xs text-slate-400">Environment configuration, model configuration, and backend API status</p>
        </div>
      </div>

      {/* Health Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>API Key Status</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="pt-2">
            {health?.api_key_configured ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" /> Configured & Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" /> Not Configured
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Read from GEMINI_API_KEY environment variable</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>LLM Engine</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="pt-2 text-white font-bold text-base">
            {health?.model || "gemini-2.5-flash"}
          </div>
          <p className="text-[11px] text-slate-500">Google Gemini API via Python SDK / REST</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Storage Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="pt-2 text-emerald-300 font-bold text-base">
            SQLite (Local)
          </div>
          <p className="text-[11px] text-slate-500">Persistent generation history storage</p>
        </div>
      </div>

      {/* Detailed Configuration Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          <span>API Key Setup Instructions</span>
        </h3>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            The backend securely retrieves the Gemini API key from environment variables without exposing key secrets to client-side frontend code.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 space-y-2">
            <p className="text-slate-400"># Step 1: Obtain a free Gemini API key from Google AI Studio</p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-indigo-400 hover:underline flex items-center gap-1 font-sans text-xs"
            >
              Get Gemini API Key on Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>

            <p className="text-slate-400 pt-2"># Step 2: Add your key to backend/.env file or deployment environment variables</p>
            <p className="text-emerald-400">GEMINI_API_KEY=AIzaSyYourActualKeyHere...</p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-bold text-white">About GenAI Content Studio</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          GenAI Content Studio is a full-stack Generative AI application built as a college practical mini-project demonstrating practical LLM integration, prompt engineering frameworks, and full-stack API architecture.
        </p>
      </div>
    </div>
  );
}
