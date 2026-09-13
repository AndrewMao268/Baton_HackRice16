'use client';

import React from 'react';
import { DesignTheme } from '@/lib/types';
import { X, Check, Terminal, BookOpen, Sparkles, Monitor, Users, ShieldAlert, Clock } from 'lucide-react';

interface DesignComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: DesignTheme;
  onSelectTheme: (theme: DesignTheme) => void;
}

export function DesignComparisonModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: DesignComparisonModalProps) {
  if (!isOpen) return null;

  const options: {
    id: DesignTheme;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgPreview: string;
    cardBg: string;
    fontStyle: string;
    bestFor: string;
    attributes: string[];
    description: string;
  }[] = [
    {
      id: 'command',
      title: 'Option A: Mission Control',
      subtitle: 'Precision Slate & Live Telemetry',
      icon: Terminal,
      accentColor: '#10b981',
      bgPreview: '#090d16',
      cardBg: '#131c2e',
      fontStyle: 'Monospace data clocks + crisp technical sans',
      bestFor: '24/7 Operations, Engineering, Fintech, Round-the-clock Incident Response',
      attributes: [
        'Deep slate contrast (#090d16) to prevent eye fatigue during night handoffs',
        'Live ticking world clocks with millisecond precision indicators',
        'High-density telemetry chips (🟢 Working, 🟡 Syncing, 🔴 Blocked)',
        'Compact data matrix layout designed for high informational throughput',
      ],
      description:
        'Inspired by aerospace flight control and global NOCs. Every timezone is treated as an active radar track with glowing relay baton paths.',
    },
    {
      id: 'editorial',
      title: 'Option B: Executive Editorial',
      subtitle: 'Warm Stone & Paper Clarity',
      icon: BookOpen,
      accentColor: '#9a3412',
      bgPreview: '#faf8f5',
      cardBg: '#ffffff',
      fontStyle: 'Refined editorial serif titles + warm neutral sans',
      bestFor: 'Management Consulting, Strategy Leadership, Creative Agencies, Corporate C-Suite',
      attributes: [
        'Warm paper canvas (#faf8f5) with zero harsh digital glare',
        'Narrative-first cards prioritizing human-written handoff summaries',
        'Terracotta (#9a3412) and warm copper accents for deliberate focal points',
        'Spacious, calming layout minimizing end-of-day cognitive overwhelm',
      ],
      description:
        'Designed for high-stakes business decisions. Replaces chaotic Slack noise with an executive briefing binder feel that is calm, authoritative, and frictionless.',
    },
    {
      id: 'pulse',
      title: 'Option C: Relay Pulse',
      subtitle: 'Daylight Flow & Human Presence',
      icon: Sparkles,
      accentColor: '#4f46e5',
      bgPreview: '#f8fafc',
      cardBg: '#ffffff',
      fontStyle: 'Vibrant modern geometric sans',
      bestFor: 'Product Design, Brand Marketing, Distributed Tech, Global Agile Squads',
      attributes: [
        'Visual daylight progression bar tracking sun hours across Tokyo, London, NY',
        'Human-centric presence cards with prominent teammate avatars & status tags',
        'Tactile "🟢 Pass the Baton" floating trigger with relay race track visuals',
        'Balanced card padding with soft, elegant neutral shadows',
      ],
      description:
        'Translates the athletic relay metaphor directly into the UI. Workflows feel like a smooth baton transfer from one running teammate to the next as the sun crosses continents.',
    },
  ];

  return (
    <div
      id="design-comparison-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="design-comparison-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Design Tailoring System
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred design</span>
            </div>
            <h2 className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
              Tailor Baton to Your Global Team’s Culture
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Preview and compare the 3 distinct architectural design directions created for Baton. You can switch between them at any time using the top preview bar.
            </p>
          </div>

          <button
            id="btn-close-comparison"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = currentTheme === opt.id;
            return (
              <div
                key={opt.id}
                id={`comparison-card-${opt.id}`}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-lg bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900/60'
                }`}
              >
                <div>
                  {/* Visual Header swatch */}
                  <div
                    className="w-full h-24 rounded-lg p-3 flex flex-col justify-between mb-4 border border-black/10"
                    style={{ backgroundColor: opt.bgPreview }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: opt.accentColor,
                          color: '#ffffff',
                        }}
                      >
                        {opt.id}
                      </span>
                      <Icon className="w-4 h-4 text-white opacity-80" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.accentColor }} />
                      <div className="w-8 h-2 rounded bg-white/20" />
                      <div className="w-12 h-2 rounded bg-white/10" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{opt.title}</h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{opt.subtitle}</p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {opt.description}
                  </p>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Best for: </span>
                        <span className="text-slate-600 dark:text-slate-400">{opt.bestFor}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Typography: </span>
                        <span className="text-slate-600 dark:text-slate-400">{opt.fontStyle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Key Design Signatures:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {opt.attributes.map((attr, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 shrink-0">•</span>
                          <span>{attr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id={`btn-apply-theme-${opt.id}`}
                    onClick={() => {
                      onSelectTheme(opt.id);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {isSelected ? 'Currently Selected' : `Apply ${opt.title.split(':')[1]}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              You can test all interactive features (Passing the Baton, resolving blockers, AI Memory search) under any design!
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Close and return to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
