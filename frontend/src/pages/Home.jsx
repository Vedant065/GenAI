import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  FileText, 
  BookOpen, 
  Wand2, 
  Sliders, 
  ArrowRight, 
  Cpu, 
  Code2, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

const modes = [
  {
    id: 'email',
    name: 'Email Generator',
    path: '/email',
    icon: Mail,
    color: 'from-blue-500 to-indigo-600',
    desc: 'Craft structured emails tailored to recipient, tone (Professional, Formal, Friendly, etc.), and custom length requirements.'
  },
  {
    id: 'report',
    name: 'Report Generator',
    path: '/report',
    icon: FileText,
    color: 'from-purple-500 to-indigo-600',
    desc: 'Generate academic and technical reports complete with executive summaries, problem statements, methodology, and conclusions.'
  },
  {
    id: 'explain',
    name: 'Technical Explainer',
    path: '/explain',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    desc: 'Break down complex topics like Neural Networks, REST API, Kubernetes, or Transformers across Beginner, Intermediate, and Advanced levels.'
  },
  {
    id: 'improve',
    name: 'Text Improver',
    path: '/improve',
    icon: Wand2,
    color: 'from-amber-500 to-orange-600',
    desc: 'Transform raw or ungrammatical text into articulate, error-free prose with style notes and executive-level alternatives.'
  },
  {
    id: 'prompt',
    name: 'Prompt Generator',
    path: '/prompt',
    icon: Sliders,
    color: 'from-pink-500 to-rose-600',
    desc: 'Convert plain user requests into production-grade, 6-part Prompt Engineering templates for LLMs.'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>GenAI College Mini-Project &bull; Prompt Engineering Demo</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            GenAI <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Content Studio</span>
          </h1>

          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            Create professional content with the power of Generative AI. Harness Gemini 2.5 Flash and structured prompt engineering to generate emails, reports, technical explanations, and optimized prompts.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate('/email')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition transform active:scale-95"
            >
              <span>Explore AI Studio Modes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition"
            >
              View Project Architecture
            </button>
          </div>
        </div>
      </div>

      {/* 5 AI Studio Mode Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Generation Modes</h2>
            <p className="text-xs text-slate-400">Select a specialized mode powered by modular prompt templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => navigate(mode.path)}
                className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} p-0.5 mb-5 flex items-center justify-center shadow-md`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                    <span>{mode.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </h3>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-indigo-400">
                  <span className="font-semibold uppercase tracking-wider">Launch Mode</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500/0 group-hover:bg-indigo-400 transition"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Project Aim & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Google Gemini LLM</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Powered by Google's state-of-the-art Gemini LLM API via secure backend execution.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Prompt Engineering</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Structured templates (Role + Context + Task + Constraints + Format) maximize response accuracy.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Full-Stack FastAPI & React</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Clean separation of React frontend, FastAPI backend REST endpoints, and SQLite history persistence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
