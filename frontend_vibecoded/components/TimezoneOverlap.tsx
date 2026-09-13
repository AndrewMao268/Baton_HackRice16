'use client';

import React, { useState } from 'react';
import { COLLABORATION_WINDOWS } from '@/lib/mock-data';
import { DesignTheme } from '@/lib/types';
import { Clock, Calendar, Check, Zap, ArrowRight } from 'lucide-react';

interface TimezoneOverlapProps {
  currentTheme: DesignTheme;
}

export function TimezoneOverlap({ currentTheme }: TimezoneOverlapProps) {
  const [selectedPair, setSelectedPair] = useState<number>(0);

  // 24 hour blocks (represented from 6 AM to 10 PM in 2-hour increments)
  const hourLabels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];

  // Working hour visual ranges relative to UTC:
  // NYC: 9 AM - 6 PM EDT (13:00 - 22:00 UTC) -> 8AM - 6PM relative
  // London: 9 AM - 5:30 PM BST (08:00 - 16:30 UTC)
  // Tokyo: 9 AM - 6 PM JST (00:00 - 09:00 UTC)

  return (
    <section
      id="timezone-overlap-visualizer"
      className={`rounded-2xl border transition-all duration-200 ${
        currentTheme === 'command'
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : currentTheme === 'editorial'
          ? 'bg-white border-stone-200 text-stone-900'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              currentTheme === 'command'
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentTheme === 'editorial'
                ? 'bg-stone-100 text-stone-900'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-base font-extrabold ${
                currentTheme === 'editorial' ? 'font-serif' : ''
              }`}
            >
              Timezone Overlap Visualizer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When are teams actively online together for live baton handoffs?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span className="text-[11px] text-slate-500">Working Hours</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 ml-2" />
          <span className="text-[11px] text-slate-500">Golden Overlap</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Timeline hour grid header */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-9 text-[10px] sm:text-xs font-mono text-slate-400 pl-24 pr-2 text-center">
            {hourLabels.map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>

          {/* New York Row */}
          <div className="flex items-center gap-3">
            <span className="w-20 sm:w-24 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
              NEW YORK
            </span>
            <div className="flex-1 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center">
              {/* Working hours 9am - 6pm (col 1.5 to 6) */}
              <div
                className="absolute h-full rounded bg-emerald-500/80 dark:bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ left: '18%', width: '56%' }}
              >
                9 AM – 6 PM EDT
              </div>
              {/* Overlap with London 10am - 1pm NY time */}
              <div
                className="absolute h-full bg-amber-400/90 dark:bg-amber-500 flex items-center justify-center text-[10px] text-slate-950 font-black border-x-2 border-amber-600"
                style={{ left: '26%', width: '22%' }}
              >
                Overlap NY ↔ LDN
              </div>
            </div>
          </div>

          {/* London Row */}
          <div className="flex items-center gap-3">
            <span className="w-20 sm:w-24 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
              LONDON
            </span>
            <div className="flex-1 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center">
              {/* Working hours 9am - 5:30pm BST */}
              <div
                className="absolute h-full rounded bg-emerald-500/80 dark:bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ left: '5%', width: '54%' }}
              >
                9 AM – 5:30 PM BST
              </div>
              {/* Overlap with NY */}
              <div
                className="absolute h-full bg-amber-400/90 dark:bg-amber-500 flex items-center justify-center text-[10px] text-slate-950 font-black border-x-2 border-amber-600"
                style={{ left: '26%', width: '22%' }}
              >
                Overlap LDN ↔ NY
              </div>
            </div>
          </div>

          {/* Tokyo Row */}
          <div className="flex items-center gap-3">
            <span className="w-20 sm:w-24 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
              TOKYO
            </span>
            <div className="flex-1 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center">
              {/* Working hours JST */}
              <div
                className="absolute h-full rounded bg-emerald-500/80 dark:bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ left: '0%', width: '25%' }}
              >
                Morning shift overlap
              </div>
              <div
                className="absolute h-full rounded bg-emerald-500/80 dark:bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ right: '0%', width: '20%' }}
              >
                Next Day JST
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Best Collaboration Windows from Section 10 */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Calculated Best Collaboration Windows</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Live Timezone Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {COLLABORATION_WINDOWS.map((win, idx) => {
              const isSelected = selectedPair === idx;
              return (
                <div
                  key={win.pair}
                  onClick={() => setSelectedPair(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {win.pair}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      {win.hoursOverlap}h Overlap
                    </span>
                  </div>

                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    {win.bestWindow}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {win.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
