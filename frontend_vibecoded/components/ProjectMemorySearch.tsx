'use client';

import React, { useState } from 'react';
import { TimelineEvent } from '@/lib/types';
import { Sparkles, Search, Send, RefreshCw } from 'lucide-react';

interface ProjectMemorySearchProps {
  timelineEvents: TimelineEvent[];
  workspaceContext: string;
}

export function ProjectMemorySearch({
  timelineEvents,
  workspaceContext,
}: ProjectMemorySearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources?: { id: string; title: string; author: string; timestamp: string }[];
  } | null>(null);

  const sampleQuestions = [
    'What changed while I was away?',
    'Why is this presentation not finished?',
    'What does Sarah need from me?',
    'Who worked on the client proposal yesterday?',
    'What decisions have been made about the campaign?',
    'What still needs to be done before Friday?',
  ];

  const handleAskMemory = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'query-memory',
          payload: {
            query: q,
            historyContext: workspaceContext,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Baton AI could not answer this question.');
      setResult({ answer: data.answer || 'Baton AI found no relevant records in the workspace.' });
    } catch (error) {
      setResult({
        answer: error instanceof Error && error.message !== 'Failed to fetch'
          ? error.message
          : 'Baton AI could not reach Gemini. Check the API configuration and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="ai-project-memory"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#364663] flex items-center justify-between bg-[#243044]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ask Baton AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Instant Context
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Skip digging through hundreds of Slack messages, emails, and notes.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#1f293b]">
        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskMemory(query);
          }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-memory-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything: What does Sarah need from me? Why is pricing blocked?"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#364663] bg-[#17202e] text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            id="btn-ask-memory"
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm disabled:opacity-40 cursor-pointer transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

        {/* Suggested Quick Prompt Pills */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Quick Inquiries:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskMemory(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-[#364663] bg-[#17202e] text-slate-300 hover:text-white hover:border-emerald-400 hover:bg-[#1e2c3e] transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Query Result Card */}
        {result && (
          <div
            id="memory-query-result"
            className="p-4 rounded-xl border border-emerald-500/30 bg-[#162130] space-y-2.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Baton Memory Answer:</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {result.answer}
            </p>

            {result.sources && result.sources.length > 0 && (
              <div className="pt-2 border-t border-[#27384f] flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified In:
                </span>
                {result.sources.map((src, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-emerald-300 bg-[#1f2c3e] px-2 py-0.5 rounded border border-[#344662]"
                  >
                    {src.title} • {src.author} ({src.timestamp})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
