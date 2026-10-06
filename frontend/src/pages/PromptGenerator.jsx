import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw, Cpu } from 'lucide-react';
import OutputPanel from '../components/OutputPanel';
import SamplePrompts from '../components/SamplePrompts';
import { generatePrompt } from '../services/api';

const samplePrompts = [
  {
    label: "AI Presentation Prompt",
    subtext: "Create slides about AI",
    data: {
      description: "Make a slide presentation about Artificial Intelligence for college students"
    }
  },
  {
    label: "Code Reviewer Bot Prompt",
    subtext: "System prompt for Python reviewer",
    data: {
      description: "Build an automated Python code reviewer that detects bugs, security risks, and optimization tips"
    }
  },
  {
    label: "Customer Feedback Sentiment Prompt",
    subtext: "E-commerce product reviews",
    data: {
      description: "Extract sentiment, product issues, and customer satisfaction rating from e-commerce reviews"
    }
  },
  {
    label: "Technical Blog Writing Prompt",
    subtext: "SEO-optimized engineering article",
    data: {
      description: "Write an engaging technical blog post explaining Docker containerization to web developers"
    }
  }
];

export default function PromptGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!description.trim()) {
      setError("Please describe what you want the AI model to do.");
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await generatePrompt({ description });
      if (res.success) {
        setOutput(res.content);
      } else {
        setError(res.error || "Failed to generate prompt.");
      }
    } catch (err) {
      setError(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleData) => {
    setDescription(sampleData.description);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Prompt Generator</h1>
          <p className="text-xs text-slate-400">Transform basic queries into production-grade, 6-part LLM System Prompts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Describe Your AI Task / Goal <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Make a presentation about artificial intelligence for college students."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-pink-400" />
                Prompt Engineering Framework Applied:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ROLE + CONTEXT + TASK + REQUIREMENTS + CONSTRAINTS + EXPECTED OUTPUT FORMAT.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Optimizing Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Optimized Prompt</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <SamplePrompts samples={samplePrompts} onSelect={handleSelectSample} />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          <OutputPanel
            content={output}
            loading={loading}
            error={error}
            onRegenerate={() => handleSubmit()}
            onClear={() => { setOutput(''); setError(''); }}
            modeTitle="Optimized Prompt Output"
          />
        </div>
      </div>
    </div>
  );
}
