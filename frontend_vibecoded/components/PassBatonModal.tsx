'use client';

import React, { useState } from 'react';
import { ExamplePreset, HandoffItem, TeamMember } from '@/lib/types';
import { EXAMPLE_PRESETS } from '@/lib/mock-data';
import { X, ArrowRight, Check, Send, AlertOctagon, RefreshCw, Sparkles } from 'lucide-react';

interface PassBatonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeamMember;
  onDispatchHandoff: (item: HandoffItem) => void;
}

export function PassBatonModal({
  isOpen,
  onClose,
  currentUser,
  onDispatchHandoff,
}: PassBatonModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('marketing');

  // AI Generated / Editable review state
  const [accomplished, setAccomplished] = useState(EXAMPLE_PRESETS[0].accomplished);
  const [blocked, setBlocked] = useState(EXAMPLE_PRESETS[0].blocked);
  const [nextAction, setNextAction] = useState(EXAMPLE_PRESETS[0].nextAction);
  const [projectName, setProjectName] = useState('Client Presentation Deck');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ExamplePreset) => {
    setSelectedPresetId(preset.id);
    setAccomplished(preset.accomplished);
    setBlocked(preset.blocked);
    setNextAction(preset.nextAction);
    setProjectName(preset.name);
  };

  const handleAIFormat = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-handoff',
          payload: {
            department: currentUser.role,
            rawWork: accomplished,
            rawBlocker: blocked,
            rawNext: nextAction,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gemini request failed');
      if (data.accomplished) setAccomplished(data.accomplished);
      if (data.blocked) setBlocked(data.blocked);
      if (data.nextAction) setNextAction(data.nextAction);
    } catch {
      // Keep the user's existing text if the AI request cannot be completed.
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitHandoff = () => {
    const newItem: HandoffItem = {
      id: `hq-${Date.now()}`,
      priority: 'high',
      project: projectName,
      title: nextAction.slice(0, 60),
      owner: currentUser.name,
      ownerLocation: currentUser.city,
      recipient: 'Incoming Team',
      recipientLocation: 'Next Shift',
      status: 'pending',
      time: 'Just now',
      accomplished,
      blocked,
      nextAction,
    };

    onDispatchHandoff(newItem);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="pass-the-baton-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="pass-the-baton-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto bg-[#243044] border-[#364663] text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b pb-4 border-[#364663]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                End-of-Shift Context Relay
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1 text-white">
              Pass the Baton
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Package your day’s progress so the incoming timezone can continue with zero lost context.
            </p>
          </div>

          <button
            id="btn-close-pass-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2739] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets are part of the single Write Handoff flow. */}
        <div className="mt-5 border-b pb-5 border-[#364663]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Write Handoff</span>
            <span className="text-[11px] text-slate-400">3-Part Format</span>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Start with a role preset:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {EXAMPLE_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-400'
                        : 'border-[#394a69] hover:border-slate-400 bg-[#1e2739]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {preset.from} → {preset.to}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Baton Preview & Edit Section: The 3 Core Output Fields */}
        <div className="mt-6 pt-5 border-t border-[#364663] space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>Standardized 3-Part Handoff</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Review & customize before sending)
              </span>
            </span>
            <button onClick={handleAIFormat} disabled={isGenerating} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
              {isGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-amber-300" />}
              {isGenerating ? 'Formatting...' : 'Format with Gemini'}
            </button>
          </div>

          {/* 1. ACCOMPLISHED */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-[#1b2b2b]">
            <label className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>1. WORKED ON (What was worked on?)</span>
              </span>
            </label>
            <textarea
              value={accomplished}
              onChange={(e) => setAccomplished(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#394a69] bg-[#1e2739] text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* 2. BLOCKED */}
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-[#2d1c24]">
            <label className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>2. BLOCKED (What is stopping progress?)</span>
              </span>
            </label>
            <textarea
              value={blocked}
              onChange={(e) => setBlocked(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#394a69] bg-[#1e2739] text-white focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* 3. NEXT ACTION */}
          <div className="p-3.5 rounded-xl border border-sky-500/30 bg-[#1c293d]">
            <label className="flex items-center justify-between text-xs font-bold text-sky-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-sky-400" />
                <span>3. NEXT ACTION (What should happen next?)</span>
              </span>
            </label>
            <textarea
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#394a69] bg-[#1e2739] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-[#364663] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            Passing from <strong className="text-white">{currentUser.name} ({currentUser.city})</strong> to the <strong className="text-emerald-300">incoming team</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#394a69] text-slate-300 hover:bg-[#1e2739] transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-pass-baton"
              onClick={handleSubmitHandoff}
              disabled={isSubmitted}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all ${
                isSubmitted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Baton Passed to Incoming Team!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Handoff & Pass Baton</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
