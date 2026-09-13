'use client';

import React from 'react';
import { DesignTheme } from '@/lib/types';
import { Palette, Terminal, Sparkles, BookOpen, Layers } from 'lucide-react';

interface DesignSwitcherProps {
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
  onOpenComparison: () => void;
}

export function DesignSwitcher({
  currentTheme,
  onThemeChange,
  onOpenComparison,
}: DesignSwitcherProps) {
  const themes: { id: DesignTheme; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'command',
      label: '1. Mission Control',
      sub: 'Precision Slate & Telemetry',
      icon: Terminal,
    },
    {
      id: 'editorial',
      label: '2. Executive Editorial',
      sub: 'Warm Stone & Paper Clarity',
      icon: BookOpen,
    },
    {
      id: 'pulse',
      label: '3. Relay Pulse',
      sub: 'Daylight Flow & Human Presence',
      icon: Sparkles,
    },
  ];

  return (
    <aside
      id="design-preview-selector-bar"
      aria-label="Design preview selector"
      className="w-full border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-200"
      style={{
        backgroundColor:
          currentTheme === 'command'
            ? 'rgba(10, 15, 29, 0.95)'
            : currentTheme === 'editorial'
            ? 'rgba(250, 248, 245, 0.96)'
            : 'rgba(255, 255, 255, 0.95)',
        borderColor:
          currentTheme === 'command'
            ? '#1e293b'
            : currentTheme === 'editorial'
            ? '#e7e3da'
            : '#e2e8f0',
        color:
          currentTheme === 'command'
            ? '#f8fafc'
            : currentTheme === 'editorial'
            ? '#1c1917'
            : '#0f172a',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-xs tracking-wide"
            style={{
              backgroundColor:
                currentTheme === 'command'
                  ? '#1e293b'
                  : currentTheme === 'editorial'
                  ? '#ede8e1'
                  : '#e0f2fe',
              color:
                currentTheme === 'command'
                  ? '#38bdf8'
                  : currentTheme === 'editorial'
                  ? '#9a3412'
                  : '#0284c7',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>DESIGN PREVIEWS</span>
          </div>
          <span className="hidden md:inline text-xs opacity-75">
            Switch between 3 distinct interface archetypes tailored for Baton:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                id={`theme-btn-${t.id}`}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? currentTheme === 'command'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : currentTheme === 'editorial'
                      ? 'bg-stone-900 text-stone-50 shadow-sm'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : currentTheme === 'command'
                    ? 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                    : currentTheme === 'editorial'
                    ? 'hover:bg-stone-200/60 text-stone-700 border border-transparent'
                    : 'hover:bg-slate-100 text-slate-600 border border-transparent'
                }`}
                title={`Preview ${t.label}: ${t.sub}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">{t.label}</span>
                <span className="hidden xl:inline text-[11px] opacity-75">({t.sub})</span>
              </button>
            );
          })}

          <button
            id="btn-open-design-specs"
            onClick={onOpenComparison}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              currentTheme === 'command'
                ? 'border-slate-700 hover:border-slate-500 text-slate-300 bg-slate-900/60'
                : currentTheme === 'editorial'
                ? 'border-stone-300 hover:border-stone-400 text-stone-800 bg-stone-100/60'
                : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Specs</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
