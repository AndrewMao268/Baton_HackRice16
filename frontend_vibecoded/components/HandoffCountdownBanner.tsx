'use client';

import React, { useState, useEffect } from 'react';
import { DesignTheme, TeamMember } from '@/lib/types';
import { Timer, ArrowRight, AlertTriangle } from 'lucide-react';

interface HandoffCountdownBannerProps {
  currentTheme: DesignTheme;
  currentUser: TeamMember;
  onPrepareHandoff: () => void;
}

export function HandoffCountdownBanner({
  currentTheme,
  currentUser,
  onPrepareHandoff,
}: HandoffCountdownBannerProps) {
  // Real countdown timer
  const [secondsLeft, setSecondsLeft] = useState(1421); // ~23m 41s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 1421));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const pendingAttentionItems = [
    { id: '1', title: 'Campaign budget ($45k)', priority: 'high' },
    { id: '2', title: 'Presentation review (slides 19–22)', priority: 'medium' },
    { id: '3', title: 'Client feedback notes', priority: 'medium' },
  ];

  return (
    <section
      id="handoff-countdown-banner"
      className={`mb-6 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        currentTheme === 'command'
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/30 text-slate-100 shadow-md'
          : currentTheme === 'editorial'
          ? 'bg-[#fbf7ee] border-[#e8ddc4] text-stone-900'
          : 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border-amber-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left side: countdown & identity */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              currentTheme === 'command'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : currentTheme === 'editorial'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-amber-500 text-white shadow-sm'
            }`}
          >
            <Timer className="w-5 h-5 animate-spin-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                END-OF-DAY RELAY COUNTDOWN
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {currentUser.city} shift ending soon
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-0.5">
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                {currentUser.name} logs off in:
              </h3>
              <span
                className={`font-mono text-xl sm:text-2xl font-black tracking-widest ${
                  currentTheme === 'command'
                    ? 'text-amber-400'
                    : currentTheme === 'editorial'
                    ? 'text-stone-900 font-serif font-black'
                    : 'text-amber-600'
                }`}
              >
                {formatTime(secondsLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Center: items requiring attention */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>3 items need attention:</span>
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {pendingAttentionItems.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                  currentTheme === 'command'
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700'
                    : currentTheme === 'editorial'
                    ? 'bg-white text-stone-800 border border-stone-200 shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                />
                <span>{item.title}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: CTA to prepare handoff */}
        <div className="w-full lg:w-auto flex justify-end">
          <button
            id="btn-prepare-handoff"
            onClick={onPrepareHandoff}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 cursor-pointer ${
              currentTheme === 'command'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono'
                : currentTheme === 'editorial'
                ? 'bg-stone-900 hover:bg-stone-800 text-amber-50'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <span>Prepare Handoff</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
