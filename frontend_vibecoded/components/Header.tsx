'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { User as FirebaseUser } from 'firebase/auth';
import { TeamMember } from '@/lib/types';
import { Globe, User, ArrowRight, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: TeamMember;
  onPassBatonClick: () => void;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function Header({
  currentUser,
  onPassBatonClick,
  firebaseUser,
  authLoading,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  const [timeState, setTimeState] = useState({
    ny: '11:21 AM EDT',
    ldn: '4:21 PM BST',
    tky: '12:21 AM JST',
  });

  useEffect(() => {
    const updateTimes = () => {
      try {
        const now = new Date();
        const ny =
          now.toLocaleTimeString('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' EDT';
        const ldn =
          now.toLocaleTimeString('en-US', {
            timeZone: 'Europe/London',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' BST';
        const tky =
          now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Tokyo',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' JST';
        setTimeState({ ny, ldn, tky });
      } catch {
        // Safe fallback
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 border-b border-[#dce5dc] bg-[#f8f9f4]/90 text-[#17211f] shadow-[0_6px_24px_rgba(31,55,45,0.06)] backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Baton Logo Icon */}
            <div className="relative w-12 h-12 rounded-2xl bg-[#dff5e9] flex items-center justify-center shadow-md ring-4 ring-emerald-100 overflow-hidden">
              <Image src="/baton-mascot.png" alt="Baton mascot" width={64} height={64} className="h-14 w-14 object-contain -translate-y-0.5" priority />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-[#17211f] flex items-center gap-1.5">
                  <span>BATON</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#dff5e9] text-emerald-800 border border-emerald-200">
                  Global Relay
                </span>
              </div>
              <p className="text-xs text-[#66736d] mt-0.5 hidden sm:block">
                When your workday ends, your context doesn’t.
              </p>
            </div>
          </div>

          {/* Quick pass button for mobile */}
          <div className="md:hidden">
            <button
              onClick={onPassBatonClick}
              className="group flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#17211f] hover:bg-[#0e8f69] text-white shadow-[0_6px_16px_rgba(23,33,31,0.18)] hover:shadow-[0_8px_20px_rgba(14,143,105,0.28)] ring-1 ring-white/10 cursor-pointer transition-all duration-200 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.14)] animate-pulse" />
              <span>Pass Baton</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Global Live Clocks */}
        <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-[#dce5dc] bg-white/75 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#7c8982]">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>Live</span>
          </div>
          <div className="h-8 w-px bg-[#dce5dc]" />
          <div className="grid grid-cols-3 divide-x divide-[#e5ebe4]">
            <div className="min-w-[112px] px-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#33443d]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />New York</div>
              <div className="mt-0.5 font-mono text-[11px] text-[#7c8982]">{timeState.ny}</div>
            </div>
            <div className="min-w-[112px] px-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#33443d]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />London</div>
              <div className="mt-0.5 font-mono text-[11px] text-[#7c8982]">{timeState.ldn}</div>
            </div>
            <div className="min-w-[112px] px-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#33443d]"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Tokyo</div>
              <div className="mt-0.5 font-mono text-[11px] text-[#7c8982]">{timeState.tky}</div>
            </div>
          </div>
        </div>

        {/* Firebase identity and Primary "Pass the Baton" CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {firebaseUser ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[#d5e0d5] bg-white p-1 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-[#dff5e9] text-[11px] font-black text-emerald-800 ring-1 ring-emerald-200">
                {firebaseUser.photoURL ? <Image src={firebaseUser.photoURL} alt="Signed-in profile" width={32} height={32} className="h-full w-full object-cover" /> : <User className="h-4 w-4" />}
              </div>
              <div className="hidden min-w-0 sm:block">
                <span className="block max-w-[130px] truncate text-xs font-bold text-[#33443d]">{firebaseUser.displayName || firebaseUser.email}</span>
                <span className="block text-[10px] text-[#7c8982]">Signed in as {currentUser.name}</span>
              </div>
              <button type="button" onClick={onSignOut} className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-bold text-[#66736d] transition-colors hover:bg-[#eff5ef] hover:text-[#0e8f69]" title="Sign out">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <button type="button" onClick={onSignIn} disabled={authLoading} className="flex items-center gap-2 rounded-xl border border-[#c8ddd0] bg-white px-3.5 py-2.5 text-xs font-bold text-[#176b51] shadow-sm transition-all hover:border-emerald-400 hover:bg-[#effaf3] hover:shadow-md disabled:cursor-wait disabled:opacity-60">
              <LogIn className="h-4 w-4" />
              <span>{authLoading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            id="btn-pass-the-baton"
            onClick={onPassBatonClick}
            className="group hidden md:flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0e8f69] hover:bg-[#087456] text-white shadow-[0_8px_20px_rgba(14,143,105,0.2)] hover:shadow-[0_12px_26px_rgba(14,143,105,0.3)] ring-1 ring-emerald-700/20 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-100 animate-pulse" />
            </span>
            <span>Pass the Baton</span>
            <ArrowRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
