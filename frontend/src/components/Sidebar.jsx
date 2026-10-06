import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  FileText, 
  BookOpen, 
  Wand2, 
  Sliders, 
  History, 
  Settings, 
  Info, 
  PlusCircle,
  ChevronRight,
  Bot
} from 'lucide-react';

const modes = [
  { id: 'email', name: 'Email Generator', path: '/email', icon: Mail, desc: 'Draft emails with custom tones' },
  { id: 'report', name: 'Report Generator', path: '/report', icon: FileText, desc: 'Structured academic/formal reports' },
  { id: 'explain', name: 'Technical Explainer', path: '/explain', icon: BookOpen, desc: 'Concepts broken down by level' },
  { id: 'improve', name: 'Text Improver', path: '/improve', icon: Wand2, desc: 'Grammar, tone & style fixes' },
  { id: 'prompt', name: 'Prompt Generator', path: '/prompt', icon: Sliders, desc: 'Production-ready prompt templates' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewGeneration = () => {
    navigate('/');
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-tight">
              GenAI <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Studio</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">LLM Content Suite</p>
          </div>
        </div>
      </div>

      {/* New Generation CTA */}
      <div className="p-4">
        <button
          onClick={handleNewGeneration}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Generation</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI Studio Modes
          </div>
          <nav className="space-y-1">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = location.pathname === mode.path;
              return (
                <NavLink
                  key={mode.id}
                  to={mode.path}
                  onClick={() => setIsOpen && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1 truncate">{mode.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace & Help
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/history"
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <History className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              <span>Settings</span>
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Info className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              <span>About Project</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer Info Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <div className="text-xs text-slate-300 truncate">
            <p className="font-semibold text-slate-200">Gemini 2.5 Flash</p>
            <p className="text-[10px] text-slate-400">Prompt Eng. Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
