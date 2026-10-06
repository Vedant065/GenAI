import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, Zap } from 'lucide-react';
import OutputPanel from '../components/OutputPanel';
import SamplePrompts from '../components/SamplePrompts';
import { generateExplanation } from '../services/api';

const sampleTopics = [
  {
    label: "Explain CNN (Neural Networks)",
    subtext: "Convolutional Neural Networks",
    data: { topic: "Convolutional Neural Networks (CNN)", difficulty: "Beginner" }
  },
  {
    label: "Explain REST API Architecture",
    subtext: "Web APIs & HTTP methods",
    data: { topic: "REST API Architecture & HTTP Endpoints", difficulty: "Intermediate" }
  },
  {
    label: "Explain Transformers & Attention Mechanism",
    subtext: "LLM self-attention mechanisms",
    data: { topic: "Transformers Architecture and Self-Attention Mechanism", difficulty: "Advanced" }
  },
  {
    label: "Explain Docker & Containerization",
    subtext: "Containers vs Virtual Machines",
    data: { topic: "Docker Containerization and Image Orchestration", difficulty: "Beginner" }
  },
  {
    label: "Explain SQL Joins",
    subtext: "INNER, LEFT, RIGHT, FULL OUTER joins",
    data: { topic: "SQL Relational Joins & Data Querying", difficulty: "Intermediate" }
  },
  {
    label: "Explain Kubernetes Pods & Cluster Ops",
    subtext: "Container orchestration",
    data: { topic: "Kubernetes Cluster Architecture & Ingress Controllers", difficulty: "Advanced" }
  }
];

export default function TechnicalExplainer() {
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'Beginner'
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.topic.trim()) {
      setError("Please enter a technical topic to explain.");
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await generateExplanation(formData);
      if (res.success) {
        setOutput(res.content);
      } else {
        setError(res.error || "Failed to generate technical explanation.");
      }
    } catch (err) {
      setError(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleData) => {
    setFormData(sampleData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Technical Concept Explainer</h1>
          <p className="text-xs text-slate-400">Deconstruct complex CS & AI concepts into 8 structured learning modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Topic <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Convolutional Neural Networks / REST API / Docker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const selected = formData.difficulty === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: level })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        selected
                          ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-600/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                8 Structural Breakdown Modules Generated:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1. Definition &bull; 2. Simple Analogy &bull; 3. How It Works &bull; 4. Key Concepts &bull; 5. Code/Practical Example &bull; 6. Advantages &bull; 7. Limitations &bull; 8. Real-world Use Cases.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Explanation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Concept</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <SamplePrompts samples={sampleTopics} onSelect={handleSelectSample} />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          <OutputPanel
            content={output}
            loading={loading}
            error={error}
            onRegenerate={() => handleSubmit()}
            onClear={() => { setOutput(''); setError(''); }}
            modeTitle="Technical Explanation Output"
          />
        </div>
      </div>
    </div>
  );
}
