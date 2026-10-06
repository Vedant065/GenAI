import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw, CheckSquare, Square } from 'lucide-react';
import OutputPanel from '../components/OutputPanel';
import SamplePrompts from '../components/SamplePrompts';
import { generateReport } from '../services/api';

const availableSections = [
  "Introduction",
  "Problem Statement",
  "Objectives",
  "Methodology",
  "Results",
  "Discussion",
  "Conclusion",
  "Future Scope"
];

const sampleReports = [
  {
    label: "AI in Healthcare Report",
    subtext: "Medical diagnostics & ethical impact",
    data: {
      topic: "Artificial Intelligence in Modern Healthcare & Medical Diagnostics",
      purpose: "Examine key ML applications in diagnostic imaging, drug discovery, patient monitoring, and ethical constraints.",
      length: "Detailed Report",
      academic_level: "Undergraduate",
      sections: ["Introduction", "Problem Statement", "Objectives", "Methodology", "Results", "Discussion", "Conclusion", "Future Scope"]
    }
  },
  {
    label: "Machine Learning in Education",
    subtext: "Personalized learning & automated grading",
    data: {
      topic: "Impact of Machine Learning on Higher Education and E-Learning Platforms",
      purpose: "Assess adaptive learning algorithms, automated grading tools, student retention prediction, and privacy concerns.",
      length: "Detailed Report",
      academic_level: "Undergraduate",
      sections: ["Introduction", "Problem Statement", "Objectives", "Results", "Discussion", "Conclusion"]
    }
  },
  {
    label: "Cybersecurity Threat Analysis",
    subtext: "Zero-trust architecture & AI defense",
    data: {
      topic: "Next-Generation Cybersecurity: AI-Driven Threat Detection & Zero Trust Architecture",
      purpose: "Analyze ransomware proliferation, automated threat mitigation, behavioral analytics, and enterprise implementation.",
      length: "Comprehensive Study",
      academic_level: "Postgraduate",
      sections: ["Introduction", "Problem Statement", "Objectives", "Methodology", "Results", "Discussion", "Conclusion", "Future Scope"]
    }
  },
  {
    label: "Generative AI Technical Impact",
    subtext: "LLMs, RAG, and software productivity",
    data: {
      topic: "Generative AI Systems: Architectural Frameworks and Developer Productivity Impact",
      purpose: "Investigate Transformer architectures, Retrieval-Augmented Generation (RAG), and developer workflow enhancements.",
      length: "Detailed Report",
      academic_level: "Executive/Professional",
      sections: ["Introduction", "Objectives", "Methodology", "Discussion", "Conclusion"]
    }
  }
];

export default function ReportGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    purpose: '',
    length: 'Detailed Report',
    academic_level: 'Undergraduate',
    sections: [...availableSections]
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const toggleSection = (sectionName) => {
    setFormData(prev => {
      const exists = prev.sections.includes(sectionName);
      return {
        ...prev,
        sections: exists 
          ? prev.sections.filter(s => s !== sectionName)
          : [...prev.sections, sectionName]
      };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.topic.trim() || !formData.purpose.trim()) {
      setError("Please fill in both the Report Topic and Purpose fields.");
      return;
    }

    if (formData.sections.length === 0) {
      setError("Please select at least one required section for the report.");
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await generateReport(formData);
      if (res.success) {
        setOutput(res.content);
      } else {
        setError(res.error || "Failed to generate report.");
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
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Report Generator</h1>
          <p className="text-xs text-slate-400">Build comprehensive academic and formal reports with custom structural sections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Report Topic <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Artificial Intelligence in Healthcare"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Purpose / Objective <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g. Evaluate the role of deep learning in diagnostic imaging and patient data privacy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic / Audience Level
                </label>
                <select
                  value={formData.academic_level}
                  onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Executive/Professional">Executive / Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Report Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Short Summary">Short Summary</option>
                  <option value="Detailed Report">Detailed Report</option>
                  <option value="Comprehensive Study">Comprehensive Study</option>
                </select>
              </div>
            </div>

            {/* Section Selection Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Required Report Sections ({formData.sections.length}/{availableSections.length})
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {availableSections.map((sec) => {
                  const selected = formData.sections.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleSection(sec)}
                      className={`flex items-center gap-2 text-xs font-medium p-1.5 rounded-lg transition text-left ${
                        selected 
                          ? 'text-indigo-300 bg-indigo-950/40 border border-indigo-500/30' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {selected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{sec}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <SamplePrompts samples={sampleReports} onSelect={handleSelectSample} />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          <OutputPanel
            content={output}
            loading={loading}
            error={error}
            onRegenerate={() => handleSubmit()}
            onClear={() => { setOutput(''); setError(''); }}
            modeTitle="Generated Report Output"
          />
        </div>
      </div>
    </div>
  );
}
