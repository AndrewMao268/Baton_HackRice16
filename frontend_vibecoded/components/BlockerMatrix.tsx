'use client';

import React, { useState } from 'react';
import { ActiveBlocker } from '@/lib/types';
import { ShieldAlert, Bell, CheckCircle2, Clock } from 'lucide-react';

interface BlockerMatrixProps {
  blockers: ActiveBlocker[];
  onNudge: (blocker: ActiveBlocker) => void;
  onResolve: (id: string) => void;
}

export function BlockerMatrix({
  blockers,
  onNudge,
  onResolve,
}: BlockerMatrixProps) {
  const [nudgedIds, setNudgedIds] = useState<Record<string, boolean>>({});

  const handleNudgeClick = (blocker: ActiveBlocker) => {
    setNudgedIds((prev) => ({ ...prev, [blocker.id]: true }));
    onNudge(blocker);
    setTimeout(() => {
      setNudgedIds((prev) => ({ ...prev, [blocker.id]: false }));
    }, 3000);
  };

  const getStatusIndicator = (status: ActiveBlocker['waitingOnStatus']) => {
    switch (status) {
      case 'available':
      case 'working':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online & reachable now
          </span>
        );
      case 'meeting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            In a meeting
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Offline (diff timezone)
          </span>
        );
    }
  };

  return (
    <section
      id="active-blocker-matrix"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#364663] flex items-center justify-between bg-[#243044]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Active Blockers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {blockers.length} active
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              What is blocked, who can unblock it, and whether they are online right now.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#1f293b]">
        {blockers.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-slate-400 text-xs">
            🎉 No active blockers. All workflows moving freely!
          </div>
        ) : (
          blockers.map((blk) => {
            const isNudged = nudgedIds[blk.id];
            return (
              <div
                key={blk.id}
                id={`blocker-card-${blk.id}`}
                className="p-4 rounded-xl border border-[#364663] bg-[#17202e] text-slate-100 flex flex-col justify-between transition-all hover:border-slate-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      {blk.urgency === 'critical' ? 'High Urgency' : 'Moderate'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {blk.sinceTime}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white mb-2 leading-snug">
                    {blk.project}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-slate-400 shrink-0">
                        Waiting on:
                      </span>
                      <span className="font-bold text-slate-200">
                        {blk.waitingOn} ({blk.waitingOnLocation})
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-slate-400 shrink-0">
                        Need:
                      </span>
                      <span className="text-slate-200 font-medium">
                        {blk.need}
                      </span>
                    </div>

                    <div className="pt-1.5">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Status:</div>
                      {getStatusIndicator(blk.waitingOnStatus)}
                    </div>
                  </div>

                  <p className="mt-3 p-2 rounded-lg bg-[#222d3e] border border-[#34445f] text-[11px] text-slate-300 leading-relaxed">
                    💡 {blk.unblockActionHint}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2a384f] flex items-center justify-between gap-2">
                  <button
                    id={`btn-nudge-${blk.id}`}
                    onClick={() => handleNudgeClick(blk)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isNudged
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-[#26344a] hover:bg-[#31425e] text-slate-200 border border-[#394a69]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isNudged ? 'Nudge Sent!' : 'Ping Owner'}</span>
                  </button>

                  <button
                    onClick={() => onResolve(blk.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
