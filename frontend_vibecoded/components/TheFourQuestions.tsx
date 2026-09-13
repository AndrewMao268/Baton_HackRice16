'use client';

import React from 'react';
import { DesignTheme } from '@/lib/types';
import { CheckCircle2, AlertOctagon, UserCheck, ArrowRightCircle } from 'lucide-react';

interface TheFourQuestionsProps {
  currentTheme: DesignTheme;
  onFilterBlockers: () => void;
  onFilterQueue: () => void;
  onViewFeed: () => void;
}

export function TheFourQuestions({
  currentTheme,
  onFilterBlockers,
  onFilterQueue,
  onViewFeed,
}: TheFourQuestionsProps) {
  const cards = [
    {
      id: 'what-happened',
      question: 'WHAT HAPPENED?',
      headline: 'Slides 1–18 finalized & market research appended',
      detail: 'London & NY wrapped design foundations and North American market sizing.',
      icon: CheckCircle2,
      accent: '#10b981',
      badge: '3 handoffs today',
      actionLabel: 'View Feed',
      onClick: onViewFeed,
    },
    {
      id: 'whats-blocked',
      question: "WHAT'S BLOCKED?",
      headline: 'Final enterprise pricing table approval',
      detail: 'Waiting on Michael Vance (New York) to sign off on Tier 2 discount table.',
      icon: AlertOctagon,
      accent: '#ef4444',
      badge: '2 active blockers',
      actionLabel: 'Inspect Blockers',
      onClick: onFilterBlockers,
    },
    {
      id: 'who-acts',
      question: 'WHO NEEDS TO ACT?',
      headline: 'Michael Vance (NY) & Emma Hayes (LDN)',
      detail: 'Michael is online now in NYC; Emma is in a client meeting until 11:30 AM.',
      icon: UserCheck,
      accent: '#f59e0b',
      badge: '2 action owners',
      actionLabel: 'Check Presence',
      onClick: onFilterQueue,
    },
    {
      id: 'whats-next',
      question: "WHAT'S HAPPENING NEXT?",
      headline: 'Finish slides 19–22 before 10 AM client meeting',
      detail: 'Package deck and send to executive review once pricing is confirmed.',
      icon: ArrowRightCircle,
      accent: '#3b82f6',
      badge: 'Due 1:00 PM',
      actionLabel: 'Open Queue',
      onClick: onFilterQueue,
    },
  ];

  return (
    <section id="the-four-questions-banner" className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2
          className={`text-xs font-bold uppercase tracking-wider ${
            currentTheme === 'command'
              ? 'text-slate-400 font-mono'
              : currentTheme === 'editorial'
              ? 'text-stone-500 font-serif'
              : 'text-slate-500'
          }`}
        >
          Instant Team State — The 4 Core Questions
        </h2>
        <span
          className={`text-[11px] ${
            currentTheme === 'command' ? 'text-emerald-400 font-mono' : 'text-slate-500'
          }`}
        >
          Live Global Picture
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              id={`question-card-${c.id}`}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-150 hover:shadow-md ${
                currentTheme === 'command'
                  ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-slate-700'
                  : currentTheme === 'editorial'
                  ? 'bg-white border-stone-200 text-stone-900 hover:border-stone-300'
                  : 'bg-white border-slate-200/90 text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: c.accent }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {c.question}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      currentTheme === 'command'
                        ? 'bg-slate-800 text-slate-300'
                        : currentTheme === 'editorial'
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {c.badge}
                  </span>
                </div>

                <h3
                  className={`text-sm font-bold leading-snug mb-1.5 ${
                    currentTheme === 'editorial' ? 'font-serif' : ''
                  }`}
                >
                  {c.headline}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    currentTheme === 'command'
                      ? 'text-slate-400'
                      : currentTheme === 'editorial'
                      ? 'text-stone-600'
                      : 'text-slate-500'
                  }`}
                >
                  {c.detail}
                </p>
              </div>

              <button
                onClick={c.onClick}
                className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-semibold cursor-pointer group ${
                  currentTheme === 'command'
                    ? 'border-slate-800 text-emerald-400 hover:text-emerald-300'
                    : currentTheme === 'editorial'
                    ? 'border-stone-100 text-stone-800 hover:text-stone-950'
                    : 'border-slate-100 text-indigo-600 hover:text-indigo-700'
                }`}
              >
                <span>{c.actionLabel}</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
