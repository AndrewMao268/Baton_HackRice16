'use client';

import React, { useState } from 'react';
import { DesignTheme, TimelineEvent } from '@/lib/types';
import { History, CheckCircle, AlertOctagon, HelpCircle, ArrowRight, Filter } from 'lucide-react';

interface ChronologicalProjectFeedProps {
  events: TimelineEvent[];
  selectedProjectFilter?: string;
}

export function ChronologicalProjectFeed({
  events,
  selectedProjectFilter,
}: ChronologicalProjectFeedProps) {
  const [filter, setFilter] = useState<string>(selectedProjectFilter || 'all');

  const projects = ['all', 'Client Presentation Deck', 'Q4 Marketing Campaign', 'Global Product Redesign'];

  const filteredEvents = filter === 'all' ? events : events.filter((e) => e.project.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(e.project.toLowerCase()));

  const getEventBadge = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'handoff':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Baton Passed
          </span>
        );
      case 'accomplished':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Accomplished
          </span>
        );
      case 'blocker':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800/50">
            <AlertOctagon className="w-3 h-3" />
            Blocker Logged
          </span>
        );
      case 'decision':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
            <HelpCircle className="w-3 h-3" />
            Team Decision
          </span>
        );
    }
  };

  return (
    <section
      id="chronological-project-feed"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#364663] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#243044]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Relay Timeline
            </h3>
            <p className="text-xs text-slate-300">
              Clear chronological story: who finished what and handed off next steps.
            </p>
          </div>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400 mr-1">Filter:</span>
          {projects.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                filter === p
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                  : 'bg-[#1b2535] text-slate-300 border-[#364663] hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Projects' : p.replace(' Deck', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#1f293b]">
        <div className="relative pl-6 border-l-2 border-[#364663] space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} id={`timeline-event-${event.id}`} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#1f293b] transition-transform group-hover:scale-125 ${
                  event.type === 'handoff'
                    ? 'bg-emerald-400'
                    : event.type === 'blocker'
                    ? 'bg-rose-400'
                    : event.type === 'decision'
                    ? 'bg-amber-400'
                    : 'bg-sky-400'
                }`}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {event.author}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({event.authorLocation} • {event.authorRole})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{event.timestamp}</span>
                  {getEventBadge(event.type)}
                </div>
              </div>

              <div className="text-[11px] font-semibold text-emerald-400 mb-1">
                Project: <span className="text-slate-200">{event.project}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#17202e] p-3 rounded-xl border border-[#364663]">
                {event.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
