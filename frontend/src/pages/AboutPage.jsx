import React from 'react';
import { Info, Code2, Cpu, Zap, Database, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>College Practical Mini-Project Documentation</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          GenAI Content Studio &bull; Technical Overview
        </h1>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Official Project Aim</h2>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            "Develop a Generative AI chatbot capable of generating emails, reports, and technical explanations using an LLM with prompt engineering techniques."
          </p>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Technology Stack</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "React 18", role: "Frontend UI", icon: Code2, color: "text-sky-400" },
            { name: "FastAPI", role: "Backend REST API", icon: Zap, color: "text-emerald-400" },
            { name: "Gemini LLM", role: "Generative AI", icon: Cpu, color: "text-purple-400" },
            { name: "SQLite", role: "History Database", icon: Database, color: "text-amber-400" },
          ].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-start gap-2">
                <Icon className={`w-6 h-6 ${tech.color}`} />
                <div>
                  <h3 className="text-sm font-bold text-white">{tech.name}</h3>
                  <p className="text-[11px] text-slate-400">{tech.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concepts Demonstrated */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">Core Concepts Demonstrated</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Generative AI & LLMs",
              desc: "Integration with Google's Gemini 2.5 Flash model for zero-shot and few-shot natural language generation."
            },
            {
              title: "Prompt Engineering Framework",
              desc: "Structured prompt templates using (Role + Context + Task + User Input + Constraints + Output Format) to eliminate hallucinations and enforce formatting."
            },
            {
              title: "Full-Stack REST Architecture",
              desc: "Decoupled React single-page application communicating with an asynchronous Python FastAPI backend server."
            },
            {
              title: "Persistent State & Database",
              desc: "Local SQLite database storage with CRUD endpoints for managing output history records."
            }
          ].map((item, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Engineering Methodology Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">Prompt Engineering Workflow</h2>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3">
          <div className="text-indigo-400 font-bold">User Input (Raw Form Data)</div>
          <div className="text-slate-500 pl-4">↓ Passes to Backend Prompt Engine</div>
          <div className="text-purple-300 font-bold pl-4 bg-slate-900 p-3 rounded-lg border border-purple-500/20">
            [ROLE DEFINITION] + [CONTEXT] + [PRIMARY TASK] + [USER INPUT] + [CONSTRAINTS] + [OUTPUT FORMAT]
          </div>
          <div className="text-slate-500 pl-4">↓ Sent to Gemini API via Python HTTP/SDK</div>
          <div className="text-emerald-400 font-bold pl-4">Formatted Markdown Output (Rendered in React)</div>
        </div>
      </div>
    </div>
  );
}
