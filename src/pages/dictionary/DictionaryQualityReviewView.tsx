import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Link2,
  ListTree,
  FileText,
  Send,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ReviewArticle } from '../../data/dictionaryMockData';

interface DictionaryQualityReviewViewProps {
  article: ReviewArticle;
  onApproveArticle: (id: string) => void;
  onRequestChanges: (id: string, notes: string) => void;
  onRejectArticle: (id: string) => void;
}

export const DictionaryQualityReviewView: React.FC<DictionaryQualityReviewViewProps> = ({
  article,
  onApproveArticle,
  onRequestChanges,
  onRejectArticle,
}) => {
  const [changeNotes, setChangeNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleApprove = () => {
    onApproveArticle(article.id);
    setActionSuccessMessage('Article has been approved and moved to the Ready for Publication queue!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRequestChangesSubmit = () => {
    if (!changeNotes.trim()) return;
    onRequestChanges(article.id, changeNotes);
    setActionSuccessMessage('Feedback saved and status updated to Changes Requested.');
    setShowNotesInput(false);
    setChangeNotes('');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = () => {
    onRejectArticle(article.id);
    setActionSuccessMessage('Article marked as Rejected.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert Feedback */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
              Quality Review Gate
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 font-medium">Author: {article.lastEditedBy}</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
            {article.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            <span>Primary Keyword: <strong className="text-gray-800">{article.primaryKeyword}</strong></span>
            <span>·</span>
            <span>Word Count: <strong className="text-gray-800">{article.wordCount} words</strong></span>
            <span>·</span>
            <span>Status: <strong className="text-amber-700">{article.overallStatus}</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleApprove}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Approve Content</span>
          </button>

          <button
            onClick={() => setShowNotesInput(!showNotesInput)}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Request Changes</span>
          </button>

          <button
            onClick={handleReject}
            className="px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-700 border border-gray-200 text-xs font-bold cursor-pointer transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Expandable Notes Input for Request Changes */}
      {showNotesInput && (
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-amber-900">
            Editorial Feedback & Requested Changes (Demo):
          </label>
          <textarea
            value={changeNotes}
            onChange={(e) => setChangeNotes(e.target.value)}
            placeholder="E.g. Please expand section 2 with an additional paragraph clarifying the astronomical orbit speed..."
            rows={3}
            className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNotesInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestChangesSubmit}
              className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Send to Author</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: 2 Columns (Left: Content & SEO Architecture; Right: Quality Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Metadata, Heading Tree & Sample Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SERP Meta Preview */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              SERP Snippet & Meta Description
            </span>
            <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200/70 space-y-1">
              <span className="text-xs text-emerald-800 font-mono block">
                https://aurenstar.com/dictionary/{article.slug}
              </span>
              <h3 className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer">
                {article.title} | Aurenstar Dictionary
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {article.metaDescription}
              </p>
            </div>
          </div>

          {/* Sample Article Content Body */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Editorial Draft Body Preview</span>
              </span>
              <span className="text-[11px] text-gray-400">Full 1,940 words loaded</span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4 font-normal">
              {article.contentSample.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Heading Structure (H1 - H3) & Internal Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heading Tree */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <ListTree className="w-4 h-4 text-emerald-600" />
                <span>Headings Hierarchy</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {article.headings.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-1.5 rounded-lg ${
                      h.level === 1
                        ? 'font-extrabold text-gray-900 bg-emerald-50/50 pl-2'
                        : h.level === 2
                        ? 'font-bold text-gray-800 pl-4'
                        : 'font-normal text-gray-600 pl-7'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-emerald-700 shrink-0">H{h.level}</span>
                    <span className="truncate">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Links Suggested */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <Link2 className="w-4 h-4 text-emerald-600" />
                <span>Internal Links (Topic Cluster)</span>
              </div>
              <div className="space-y-2 text-xs">
                {article.internalLinks.map((link, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 block truncate max-w-[160px]">
                        "{link.anchor}"
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700">{link.targetUrl}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        link.status === 'Valid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {link.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): 6-Point Quality Checklist */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Quality Review Checklist</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700">5/6 Passed</span>
            </div>

            <div className="space-y-3 text-xs">
              {article.checks.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    chk.status === 'Passed'
                      ? 'border-emerald-200/80 bg-emerald-50/30'
                      : chk.status === 'Needs Review'
                      ? 'border-amber-200/80 bg-amber-50/30'
                      : 'border-rose-200/80 bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{chk.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        chk.status === 'Passed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : chk.status === 'Needs Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2 leading-snug">{chk.description}</p>
                  <div className="p-2 bg-white rounded-lg border border-gray-200/60 text-[11px] text-gray-700 leading-relaxed font-normal">
                    {chk.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
