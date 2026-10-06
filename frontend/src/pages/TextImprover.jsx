import React, { useState } from 'react';
import { Wand2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import OutputPanel from '../components/OutputPanel';
import SamplePrompts from '../components/SamplePrompts';
import { generateImprovement } from '../services/api';

const sampleTexts = [
  {
    label: "Grammar & Run-on Sentence Fix",
    subtext: "General AI usefulness quote",
    data: {
      text: "AI is very useful technology which can help peoples to doing many work and it save time so everyone should learn it."
    }
  },
  {
    label: "Informal Project Update Fix",
    subtext: "Polishing team communication",
    data: {
      text: "hey team i finished the code for the backend and now api working fine but we need test database connection again because sometimes it drop."
    }
  },
  {
    label: "Rough Resume Summary",
    subtext: "Transforming into executive bio",
    data: {
      text: "I am a computer science student doing python coding and AI projects like chatbots and machine learning models for college and looking for job in tech company."
    }
  },
  {
    label: "Poor Academic Abstract Draft",
    subtext: "Formalizing research overview",
    data: {
      text: "In this paper we show how CNN works for picture classification and we get 95% accuracy which is better than old methods."
    }
  }
];

export default function TextImprover() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setError("Please paste or type text to improve.");
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await generateImprovement({ text });
      if (res.success) {
        setOutput(res.content);
      } else {
        setError(res.error || "Failed to improve text.");
      }
    } catch (err) {
      setError(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleData) => {
    setText(sampleData.text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Wand2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Text Improver</h1>
          <p className="text-xs text-slate-400">Fix grammar, elevate tone, and receive executive rewriting options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Raw / Draft Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. AI is very useful technology which can help peoples to doing many work and it save time."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Improvement Analysis Sections:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ✍️ Direct Corrected Version &bull; 🚀 Executive / Professional Variant &bull; 🔍 Grammar Fixes &bull; 💡 Style Insights.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Improving Text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Improve Text</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <SamplePrompts samples={sampleTexts} onSelect={handleSelectSample} />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          <OutputPanel
            content={output}
            loading={loading}
            error={error}
            onRegenerate={() => handleSubmit()}
            onClear={() => { setOutput(''); setError(''); }}
            modeTitle="Text Improvement Output"
          />
        </div>
      </div>
    </div>
  );
}
