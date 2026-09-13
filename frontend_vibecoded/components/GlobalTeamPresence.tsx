'use client';

import React from 'react';
import { OfficePresence, TeamMember } from '@/lib/types';
import { Users, Sun, Moon } from 'lucide-react';

interface GlobalTeamPresenceProps {
  offices: OfficePresence[];
  onToggleStatus?: (memberId: string) => void;
  compact?: boolean;
}

export function GlobalTeamPresence({
  offices,
  onToggleStatus,
  compact = false,
}: GlobalTeamPresenceProps) {
  const getStatusDot = (status: TeamMember['status']) => {
    switch (status) {
      case 'working':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-xs shadow-emerald-400/50 animate-pulse" title="Working" />;
      case 'available':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" title="Available" />;
      case 'meeting':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" title="In Meeting" />;
      case 'offline':
        return <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" title="Offline" />;
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'working':
        return 'Working';
      case 'available':
        return 'Available';
      case 'meeting':
        return 'Meeting';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <section
      id="global-team-presence"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-[#364663] flex items-center justify-between bg-[#243044]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Who’s Online Right Now?</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Can I reach this colleague right now?
            </p>
          </div>
        </div>
      </div>

      <div className={`p-4 ${compact ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'} bg-[#1f293b]`}>
        {offices.map((office) => (
          <div
            key={office.id}
            id={`presence-office-${office.id}`}
            className="p-3.5 rounded-xl border border-[#364663] bg-[#17202e]"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#2a384f]">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                  {office.city}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {office.workHours}
                </span>
              </div>

              <div>
                {office.isCurrentlyWorkHours ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <Sun className="w-3 h-3 text-amber-300" /> Active Hours
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    <Moon className="w-3 h-3 text-slate-400" /> After Hours
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {office.members.map((member) => (
                <div
                  key={member.id}
                  id={`member-row-${member.id}`}
                  onClick={() => onToggleStatus && onToggleStatus(member.id)}
                  className="p-2 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer hover:bg-[#202c3f] border border-transparent hover:border-[#364663]"
                  title="Click to toggle status"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#2a384f] text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 border border-[#364663]">
                      {member.avatar}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-[10px] text-slate-400">
                      {getStatusText(member.status)}
                    </span>
                    {getStatusDot(member.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
