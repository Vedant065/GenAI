import React, { useState } from 'react';
import { Mail, Send, Sparkles, RefreshCw } from 'lucide-react';
import OutputPanel from '../components/OutputPanel';
import SamplePrompts from '../components/SamplePrompts';
import { generateEmail } from '../services/api';

const sampleEmails = [
  {
    label: "Extension Request to Professor",
    subtext: "Academic leave / extension email",
    data: {
      purpose: "Request an extension for submitting the Artificial Intelligence term assignment",
      recipient: "Prof. Dr. R. K. Sharma",
      key_points: "Caught high fever over the weekend, medical certificate attached, asking for 3 additional days.",
      tone: "Formal",
      length: "Medium"
    }
  },
  {
    label: "Internship Application Email",
    subtext: "Apply for GenAI / ML Developer intern role",
    data: {
      purpose: "Application for Generative AI Engineering Internship position",
      recipient: "Hiring Manager / HR Team",
      key_points: "Built full-stack LLM apps with FastAPI & React, proficient in Python & PyTorch, attached resume and GitHub link.",
      tone: "Professional",
      length: "Detailed"
    }
  },
  {
    label: "Meeting Request with Mentor",
    subtext: "Schedule project guidance session",
    data: {
      purpose: "Schedule a 20-minute meeting to discuss college project progress and backend deployment",
      recipient: "Dr. Ananya Roy (Project Guide)",
      key_points: "Completed baseline UI & Gemini integration, need feedback on database architecture and prompt engineering.",
      tone: "Friendly",
      length: "Short"
    }
  },
  {
    label: "Apology for Missed Deadline",
    subtext: "Apologetic client/supervisor note",
    data: {
      purpose: "Apologize for missing the preliminary project submission deadline",
      recipient: "Course Coordinator",
      key_points: "Unexpected system crash during deployment testing, work is now complete, request permission to submit today.",
      tone: "Apologetic",
      length: "Medium"
    }
  }
];

export default function EmailGenerator() {
  const [formData, setFormData] = useState({
    purpose: '',
    recipient: '',
    key_points: '',
    tone: 'Professional',
    length: 'Medium'
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.purpose.trim() || !formData.recipient.trim()) {
      setError("Please fill in both the Email Purpose and Recipient fields.");
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await generateEmail(formData);
      if (res.success) {
        setOutput(res.content);
      } else {
        setError(res.error || "Failed to generate email.");
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
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Email Generator</h1>
          <p className="text-xs text-slate-400">Generate high-impact, custom-toned emails powered by LLM prompt engineering</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Purpose <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g. Request extension for submitting AI assignment due to illness"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Recipient Name / Designation <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="e.g. Prof. Sharma / Hiring Manager"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Key Points to Include (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.key_points}
                onChange={(e) => setFormData({ ...formData, key_points: e.target.value })}
                placeholder="e.g. Mention attached medical notes, request 3 extra days, offer to meet in office hours"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Professional">Professional</option>
                  <option value="Formal">Formal</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Apologetic">Apologetic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Short">Short (&lt; 150 words)</option>
                  <option value="Medium">Medium (150-300 words)</option>
                  <option value="Detailed">Detailed (300+ words)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Email</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <SamplePrompts samples={sampleEmails} onSelect={handleSelectSample} />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          <OutputPanel
            content={output}
            loading={loading}
            error={error}
            onRegenerate={() => handleSubmit()}
            onClear={() => { setOutput(''); setError(''); }}
            modeTitle="Generated Email Output"
          />
        </div>
      </div>
    </div>
  );
}
