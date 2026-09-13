'use client';

import React, { useState } from 'react';
import { HandoffItem } from '@/lib/types';
import { Inbox, CheckCircle2, ChevronRight, ChevronDown, Check, ArrowRight, Play } from 'lucide-react';

interface HandoffQueueProps {
  items: HandoffItem[];
  onAcceptBaton: (item: HandoffItem) => void;
  onCompleteItem: (id: string) => void;
}

export function HandoffQueue({
  items,
  onAcceptBaton,
  onCompleteItem,
}: HandoffQueueProps) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Active
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Optional
          </span>
        );
    }
  };

  const getStatusBadge = (status: HandoffItem['status']) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="text-[11px] font-medium text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
            Waiting on Dependency
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-medium text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-lg border border-sky-500/30">
            Ready for Pickup
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-[11px] font-medium text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-lg border border-purple-500/30">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
            Completed
          </span>
        );
    }
  };

  return (
    <section
      id="pending-handoff-queue"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#364663] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#243044]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Handoff Queue</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1b2535] text-slate-300 border border-[#364663]">
                {items.length} tasks
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Clear context handed over by coworkers in previous timezones.
            </p>
          </div>
        </div>

        {/* Quick Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#1b2535] rounded-xl border border-[#364663] text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'in_progress'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#364663]">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No handoff items in this view.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                id={`queue-item-${item.id}`}
                className={`transition-colors ${
                  isExpanded ? 'bg-[#1e2739]' : 'hover:bg-[#202c3f]'
                }`}
              >
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="shrink-0">{getPriorityBadge(item.priority)}</div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          {item.project}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">{item.time}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-slate-200">
                        {item.owner} ({item.ownerLocation})
                      </div>
                      <div className="text-[11px] mt-0.5">{getStatusBadge(item.status)}</div>
                    </div>

                    <button className="text-slate-400 p-1.5 hover:text-slate-200 rounded-lg hover:bg-[#253247]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Baton Context */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-6 pt-1">
                    <div className="p-4 rounded-xl border border-[#364663] bg-[#17202e] text-xs space-y-3">
                      {/* 1. Accomplished */}
                      <div className="flex items-start gap-2.5">
                        <span className="font-bold text-emerald-400 min-w-[100px] shrink-0 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Accomplished:
                        </span>
                        <span className="text-slate-200 leading-relaxed">{item.accomplished}</span>
                      </div>

                      {/* 2. Blocked */}
                      <div className="flex items-start gap-2.5">
                        <span className="font-bold text-rose-400 min-w-[100px] shrink-0 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          Blocked by:
                        </span>
                        <span className="text-slate-200 leading-relaxed">{item.blocked}</span>
                      </div>

                      {/* 3. Next Action */}
                      <div className="flex items-start gap-2.5">
                        <span className="font-bold text-sky-400 min-w-[100px] shrink-0 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                          Next Action:
                        </span>
                        <span className="text-white font-medium leading-relaxed">{item.nextAction}</span>
                      </div>

                      <div className="pt-3 border-t border-[#2a384f] flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400">
                          Assigned to: <strong className="text-slate-200">{item.recipient} ({item.recipientLocation})</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          {item.status !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAcceptBaton(item);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-sm transition-all"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Accept Baton & Start</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCompleteItem(item.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-500 hover:border-emerald-400 text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
