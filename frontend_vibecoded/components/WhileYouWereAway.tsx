'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, AlertOctagon, HelpCircle, UserCheck } from 'lucide-react';

interface WhileYouWereAwayProps {
  onActionClick: (actionType: string) => void;
}

export function WhileYouWereAway({
  onActionClick,
}: WhileYouWereAwayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updates = [
    {
      id: 'up-1',
      type: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      dotColor: 'bg-emerald-400',
      labelColor: 'text-emerald-400',
      text: 'Client presentation draft finished.',
      detail: 'Slides 1–18 formatted with new brand kit by London team.',
    },
    {
      id: 'up-2',
      type: 'blocked',
      label: 'Blocked',
      icon: AlertOctagon,
      dotColor: 'bg-rose-400',
      labelColor: 'text-rose-400',
      text: 'Final pricing still needs approval.',
      detail: 'Michael Vance in New York needed for tier-2 margin approval.',
    },
    {
      id: 'up-3',
      type: 'decision',
      label: 'Decision',
      icon: HelpCircle,
      dotColor: 'bg-amber-400',
      labelColor: 'text-amber-400',
      text: 'Team agreed to move the campaign launch to Monday.',
      detail: 'Gives 48 additional hours for legal approval in Tokyo & London.',
    },
    {
      id: 'up-4',
      type: 'action',
      label: 'Action Required',
      icon: UserCheck,
      dotColor: 'bg-sky-400',
      labelColor: 'text-sky-400',
      text: 'Sarah needs to review the final presentation.',
      detail: 'Check slides 19–22 before 1:00 PM client meeting.',
    },
  ];

  return (
    <section
      id="while-you-were-away-brief"
      className="mb-6 rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none border-b border-[#364663] hover:bg-[#28354c] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-white">
                While You Were Away
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1b2535] text-emerald-400 border border-[#364663]">
                32 overnight updates → 4 critical items
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Overnight summary synthesized across Tokyo and London shifts.
            </p>
          </div>
        </div>

        <button
          aria-label={isExpanded ? 'Collapse overnight briefing' : 'Expand overnight briefing'}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1f293b]">
          {updates.map((up) => {
            return (
              <div
                key={up.id}
                id={`brief-item-${up.id}`}
                onClick={() => onActionClick(up.type)}
                className="p-3.5 rounded-xl border border-[#364663] bg-[#17202e] flex flex-col justify-between cursor-pointer transition-all hover:border-slate-400 hover:bg-[#1a2536]"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`w-2 h-2 rounded-full ${up.dotColor}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${up.labelColor}`}>
                      {up.label}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold leading-snug mb-1 text-white">
                    {up.text}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {up.detail}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2a384f] flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>Open Context</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
