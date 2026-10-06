import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  FileText, 
  Mail, 
  BookOpen, 
  Wand2, 
  Sliders,
  Eye,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

const modeIcons = {
  email: Mail,
  report: FileText,
  explain: BookOpen,
  improve: Wand2,
  prompt: Sliders
};

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchHistory();
      setItems(res || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this history item?")) {
      try {
        await deleteHistoryItem(id);
        setItems(items.filter(item => item.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      } catch (err) {
        alert("Failed to delete item: " + err.message);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear ALL generation history?")) {
      try {
        await clearAllHistory();
        setItems([]);
        setPreviewItem(null);
      } catch (err) {
        alert("Failed to clear history: " + err.message);
      }
    }
  };

  const handleCopy = (text, id, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.output_content.toLowerCase().includes(search.toLowerCase());
    const matchesMode = selectedMode === 'all' || item.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Generation History</h1>
            <p className="text-xs text-slate-400">View and manage previous AI outputs stored in SQLite database</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history by title or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'email', 'report', 'explain', 'improve', 'prompt'].map(m => (
            <button
              key={m}
              onClick={() => setSelectedMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition ${
                selectedMode === m 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading history records...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 font-medium text-sm">No generation history found</p>
          <p className="text-xs text-slate-500">Generations will automatically be stored here after creating content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const Icon = modeIcons[item.mode] || History;
            return (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold uppercase">
                      <Icon className="w-3 h-3 text-indigo-400" />
                      {item.mode}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-normal">
                    {item.output_content.replace(/[#*`]/g, '')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <Eye className="w-3.5 h-3.5" /> View Full Output
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopy(item.output_content, item.id, e)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Copy content"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{previewItem.title}</h3>
                <p className="text-xs text-slate-400">Created: {new Date(previewItem.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 prose prose-invert max-w-none text-slate-200 text-sm">
              <ReactMarkdown>{previewItem.output_content}</ReactMarkdown>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => handleCopy(previewItem.output_content, previewItem.id)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2"
              >
                {copiedId === previewItem.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === previewItem.id ? "Copied to Clipboard!" : "Copy Content"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
