'use client';

import React, { useState, useMemo } from 'react';
import { OfficePresence, TeamMember } from '@/lib/types';
import { CalendarClock, Users, Plus, Check, Trash2 } from 'lucide-react';

interface MeetingSchedulerProps {
  offices: OfficePresence[];
  currentUser: TeamMember;
}

interface ScheduledMeeting {
  id: string;
  title: string;
  withMember: TeamMember;
  utcHour: number;
  duration: number; // in hours
}

// Rough local-working-hours model: every office works 9am-6pm local time.
// We convert that into a 0-23 UTC hour range per office so all rows share one axis.
function getUtcWorkRange(utcOffset: number) {
  const startLocal = 9;
  const endLocal = 18;
  const startUtc = ((startLocal - utcOffset) % 24 + 24) % 24;
  const endUtc = ((endLocal - utcOffset) % 24 + 24) % 24;
  return { startUtc, endUtc };
}

// Returns true if a given UTC hour falls inside an office's working range (handles wraparound).
function isHourInRange(hour: number, startUtc: number, endUtc: number) {
  if (startUtc <= endUtc) return hour >= startUtc && hour < endUtc;
  return hour >= startUtc || hour < endUtc; // wraps past midnight UTC
}

export function MeetingScheduler({ offices, currentUser }: MeetingSchedulerProps) {
  const allMembers = useMemo(() => offices.flatMap((o) => o.members), [offices]);
  const otherMembers = allMembers.filter((m) => m.id !== currentUser.id);

  const [targetId, setTargetId] = useState<string>(otherMembers[0]?.id || '');
  const targetMember = allMembers.find((m) => m.id === targetId) || otherMembers[0];

  const myOffice = offices.find((o) => o.city === currentUser.city) || offices[0];
  const targetOffice = offices.find((o) => o.members.some((m) => m.id === targetMember?.id)) || offices[0];

  const myRange = getUtcWorkRange(myOffice.utcOffset);
  const targetRange = getUtcWorkRange(targetOffice.utcOffset);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const overlapHours = hours.filter(
    (h) => isHourInRange(h, myRange.startUtc, myRange.endUtc) && isHourInRange(h, targetRange.startUtc, targetRange.endUtc)
  );

  const [selectedHour, setSelectedHour] = useState<number | null>(overlapHours[0] ?? null);
  const [title, setTitle] = useState('Sync call');
  const [duration, setDuration] = useState(1);
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);

  const formatUtcHour = (h: number) => {
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}${suffix}`;
  };

  const localHourFor = (utcHour: number, utcOffset: number) => {
    const local = ((utcHour + utcOffset) % 24 + 24) % 24;
    return formatUtcHour(local);
  };

  const handleSchedule = () => {
    if (selectedHour === null || !targetMember) return;
    setMeetings((prev) => [
      { id: `mtg-${Date.now()}`, title: title || 'Meeting', withMember: targetMember, utcHour: selectedHour, duration },
      ...prev,
    ]);
  };

  const removeMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const rows = [
    { label: `${currentUser.name} (${myOffice.city}, you)`, range: myRange, isYou: true },
    ...(targetMember
      ? [{ label: `${targetMember.name} (${targetOffice.city})`, range: targetRange, isYou: false }]
      : []),
  ];

  return (
    <section
      id="meeting-scheduler"
      className="rounded-2xl border border-[#364663] bg-[#243044] text-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#364663] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#243044]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Meeting Scheduler</h3>
            <p className="text-xs text-slate-300">
              Pick a teammate and book time inside your actual timezone overlap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={targetId}
            onChange={(e) => {
              setTargetId(e.target.value);
              setSelectedHour(null);
            }}
            className="text-xs font-semibold rounded-xl px-3 py-2 border border-[#394a69] bg-[#1e2739] text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            {otherMembers.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1e2739]">
                {m.name} ({m.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#1f293b] space-y-5">
        {/* Gantt-style timeline */}
        <div>
          <div className="grid text-[10px] sm:text-[11px] font-mono text-slate-400 pl-40 pr-1 mb-1" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
            {hours.map((h) => (
              <span key={h} className={`text-center ${h % 3 !== 0 ? 'invisible' : ''}`}>{formatUtcHour(h)}</span>
            ))}
          </div>

          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2 mb-2">
              <span className="w-40 shrink-0 text-[11px] font-bold text-slate-200 truncate pr-2">{row.label}</span>
              <div className="flex-1 grid gap-px" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                {hours.map((h) => {
                  const working = isHourInRange(h, row.range.startUtc, row.range.endUtc);
                  const inOverlap = overlapHours.includes(h);
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={!inOverlap}
                      onClick={() => setSelectedHour(h)}
                      title={`${formatUtcHour(h)} UTC`}
                      className={`h-6 sm:h-7 transition-all ${
                        isSelected
                          ? 'bg-indigo-400 ring-2 ring-indigo-300 z-10 relative'
                          : inOverlap
                          ? 'bg-amber-400/80 hover:bg-amber-300 cursor-pointer'
                          : working
                          ? 'bg-emerald-600/50'
                          : 'bg-[#151d29]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 pl-40 flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600/50" /> Working hours</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400/80" /> Overlap (clickable)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" /> Selected slot</span>
          </div>
        </div>

        {/* Booking form */}
        {overlapHours.length === 0 ? (
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200">
            No working-hour overlap with {targetMember?.name} today — consider an async handoff instead.
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-[#364663] bg-[#17202e] flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Meeting title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#394a69] bg-[#1e2739] text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="text-xs p-2.5 rounded-xl border border-[#394a69] bg-[#1e2739] text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value={0.5}>30 min</option>
                <option value={1}>1 hr</option>
                <option value={1.5}>1.5 hr</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Time {selectedHour !== null ? `(${localHourFor(selectedHour, myOffice.utcOffset)} your time / ${localHourFor(selectedHour, targetOffice.utcOffset)} their time)` : ''}
              </label>
              <button
                onClick={handleSchedule}
                disabled={selectedHour === null}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-sm disabled:opacity-40 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* Scheduled meetings list */}
        {meetings.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming scheduled</span>
            {meetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[#364663] bg-[#17202e] text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white truncate">{m.title}</span>
                  <span className="text-slate-400">with {m.withMember.name}</span>
                  <span className="text-slate-400 font-mono">
                    {formatUtcHour(m.utcHour)} UTC ({m.duration}h)
                  </span>
                </div>
                <button onClick={() => removeMeeting(m.id)} className="text-slate-400 hover:text-rose-400 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
