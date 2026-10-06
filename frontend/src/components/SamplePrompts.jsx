import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function SamplePrompts({ samples = [], onSelect }) {
  if (!samples || samples.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span>Sample Prompts (Click to Pre-fill)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {samples.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(sample.data)}
            className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition group flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-300">
              {sample.label}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300 flex items-center justify-between">
              <span>{sample.subtext || "Click to try"}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transform group-hover:translate-x-0.5 transition" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
