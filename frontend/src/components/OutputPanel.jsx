import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  Download, 
  FileText, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  Bot, 
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function OutputPanel({ 
  content, 
  loading, 
  error, 
  onRegenerate, 
  onClear, 
  modeTitle = "Generated Result" 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${modeTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    if (!content) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15;
    const pageHeight = 295;
    const maxLineWidth = 180;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(modeTitle, margin, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Clean markdown hashes for raw text export
    const cleanText = content.replace(/#/g, '');
    const lines = doc.splitTextToSize(cleanText, maxLineWidth);

    let y = 30;
    lines.forEach(line => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    doc.save(`${modeTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[450px] relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{modeTitle}</h3>
            <p className="text-[11px] text-slate-400">Prompt Engineered Gemini Output</p>
          </div>
        </div>

        {/* Action Toolbar */}
        {content && !loading && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5"
              title="Download as TXT"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">TXT</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5"
              title="Download as PDF"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5"
                title="Regenerate output"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Regen</span>
              </button>
            )}

            {onClear && (
              <button
                onClick={onClear}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition text-xs flex items-center gap-1.5"
                title="Clear output"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 animate-spin">
                <div className="w-full h-full bg-slate-900 rounded-[14px]"></div>
              </div>
              <Bot className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-300">Generating your content...</p>
              <p className="text-xs text-slate-400 mt-1">Applying prompt engineering templates & querying Gemini LLM</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm space-y-2">
            <div className="font-semibold flex items-center gap-2 text-rose-400">
              <span>⚠️ Generation Error</span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">{error}</p>
          </div>
        )}

        {!content && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-slate-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400">No Content Generated Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Fill in the form on the left or select a sample prompt to generate AI-crafted text using prompt templates.
              </p>
            </div>
          </div>
        )}

        {content && !loading && !error && (
          <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
