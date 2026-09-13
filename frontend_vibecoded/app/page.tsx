'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { HandoffItem, OfficePresence, TeamMember, TimelineEvent } from '@/lib/types';
import { INITIAL_BLOCKERS, INITIAL_HANDOFF_QUEUE, INITIAL_OFFICES, INITIAL_TIMELINE } from '@/lib/mock-data';
import { Header } from '@/components/Header';
import { WhileYouWereAway } from '@/components/WhileYouWereAway';
import { HandoffQueue } from '@/components/HandoffQueue';
import { GlobalTeamPresence } from '@/components/GlobalTeamPresence';
import { ProjectMemorySearch } from '@/components/ProjectMemorySearch';
import { ChronologicalProjectFeed } from '@/components/ChronologicalProjectFeed';
import { MeetingScheduler } from '@/components/MeetingScheduler';
import { PassBatonModal } from '@/components/PassBatonModal';
import { firebaseAuth, googleProvider } from '@/lib/firebase';
import { ArrowRight, LogIn, ShieldCheck, Sparkles } from 'lucide-react';

export default function Page() {
  // App Data State
  const [offices, setOffices] = useState<OfficePresence[]>(INITIAL_OFFICES);
  const [handoffQueue, setHandoffQueue] = useState<HandoffItem[]>(INITIAL_HANDOFF_QUEUE);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE);

  // Current active user persona (Default: Sarah Chen in New York)
  const allMembers = useMemo(() => offices.flatMap((o) => o.members), [offices]);
  const workspaceContext = useMemo(() => JSON.stringify({
    employees: allMembers,
    offices,
    handoffQueue,
    activeBlockers: INITIAL_BLOCKERS,
    timelineEvents,
  }), [allMembers, offices, handoffQueue, timelineEvents]);
  const [currentUser, setCurrentUser] = useState<TeamMember>(allMembers[0]);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthLoading(false);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);

      if (user?.displayName) {
        const signedInMember = allMembers.find(
          (member) => member.name.toLowerCase() === user.displayName?.toLowerCase()
        );
        setCurrentUser(signedInMember || {
          ...allMembers[0],
          id: `firebase-${user.uid}`,
          name: user.displayName,
          avatar: user.displayName.split(' ').map((part) => part[0]).join('').slice(0, 2),
          statusText: 'Signed in and ready to pass context',
          currentTask: 'Preparing your workspace',
        });
      }
    });
  }, [allMembers]);

  const handleSignIn = async () => {
    if (!firebaseAuth) {
      showToast('Add Firebase settings to .env.local before signing in.');
      return;
    }

    setAuthLoading(true);
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch {
      showToast('Sign-in was cancelled or could not be completed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (firebaseAuth) await signOut(firebaseAuth);
    setFirebaseUser(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers
  const handleDispatchHandoff = (item: HandoffItem) => {
    setHandoffQueue((prev) => [item, ...prev]);

    // Add to project feed
    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      project: item.project,
      author: item.owner,
      authorLocation: item.ownerLocation,
      authorRole: currentUser.role,
      type: 'handoff',
      content: `${item.accomplished} (Next: ${item.nextAction})`,
      timestamp: 'Just now',
      badgeText: 'Baton Passed',
    };
    setTimelineEvents((prev) => [newEvent, ...prev]);

    showToast(`Baton passed successfully to ${item.recipient} in ${item.recipientLocation}!`);
  };

  const handleAcceptBaton = (item: HandoffItem) => {
    setHandoffQueue((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'in_progress' } : i))
    );
    showToast(`You picked up the Baton for: "${item.title}"`);
  };

  const handleCompleteQueueItem = (id: string) => {
    setHandoffQueue((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'completed' } : i))
    );
    showToast('Handoff item marked as completed!');
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setOffices((prev) =>
      prev.map((off) => ({
        ...off,
        members: off.members.map((m) => {
          if (m.id === memberId) {
            const nextStatus =
              m.status === 'working'
                ? 'available'
                : m.status === 'available'
                ? 'meeting'
                : m.status === 'meeting'
                ? 'offline'
                : 'working';
            return { ...m, status: nextStatus };
          }
          return m;
        }),
      }))
    );
    showToast('Updated team member status');
  };

  if (!firebaseUser) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f5f5ef] text-[#17211f]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,45,38,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(24,45,38,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#dff5e9] shadow-md ring-4 ring-emerald-100">
                <Image src="/baton-mascot.png" alt="Baton mascot" width={58} height={58} className="h-14 w-14 object-contain" priority />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight">BATON</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Global Relay</div>
              </div>
            </div>
            <button onClick={handleSignIn} disabled={authLoading} className="flex items-center gap-2 rounded-xl border border-[#c8ddd0] bg-white px-4 py-2.5 text-xs font-bold text-[#176b51] shadow-sm transition hover:border-emerald-400 hover:bg-[#effaf3] disabled:opacity-60">
              <LogIn className="h-4 w-4" />
              {authLoading ? 'Checking...' : 'Sign in'}
            </button>
          </header>

          <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1fr_0.8fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7e2d7] bg-white/75 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Your global workday, connected
              </div>
              <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl">Pass the workday forward.</h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#66736d] sm:text-lg">Baton keeps every handoff clear, actionable, and ready for the next timezone to pick up.</p>
              <button onClick={handleSignIn} disabled={authLoading} className="group mt-8 flex items-center gap-3 rounded-2xl bg-[#0e8f69] px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_26px_rgba(14,143,105,0.22)] transition hover:-translate-y-0.5 hover:bg-[#087456] disabled:opacity-60">
                <LogIn className="h-4 w-4" />
                Sign in to your workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <div className="mt-5 flex items-center gap-2 text-xs text-[#7c8982]"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure sign-in powered by Google and Firebase</div>
            </div>
            <div className="relative hidden min-h-[390px] items-center justify-center lg:flex">
              <div className="absolute h-72 w-72 rounded-full bg-[#dff5e9] blur-3xl" />
              <Image src="/baton-mascot.png" alt="Baton mascot" width={420} height={420} className="relative h-[390px] w-[390px] object-contain drop-shadow-[0_24px_18px_rgba(26,78,61,0.18)] animate-[mascot-bob_4s_ease-in-out_infinite]" priority />
            </div>
          </section>
          <footer className="flex items-center justify-between border-t border-[#dfe5dc] py-5 text-xs text-[#7c8982]"><span>Tokyo · London · New York</span><span>Context that travels with your team.</span></footer>
        </div>
      </main>
    );
  }

  return (
    <div
      id="baton-root-container"
      className="min-h-screen text-[#17211f] flex flex-col selection:bg-emerald-200 selection:text-[#17211f]"
    >
      {/* 1. Header with quick user switcher and Pass the Baton CTA */}
      <Header
        currentUser={currentUser}
        onPassBatonClick={() => setIsPassModalOpen(true)}
        firebaseUser={firebaseUser}
        authLoading={authLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area — every section stacked one per row, no side-by-side columns */}
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <section className="flex flex-col sm:flex-row lg:items-end justify-between gap-5 pb-1">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">Global relay / Friday, September 12</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] text-[#17211f]">Your team, in motion.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#66736d]">A clear view of what moved overnight, what needs your attention, and who is ready to pick up the next shift.</p>
          </div>
          <div className="flex items-end gap-4 self-start sm:self-auto">
            <div className="hidden sm:block relative h-28 w-28 shrink-0">
              <div className="absolute inset-3 rounded-full bg-[#dff5e9] blur-xl" />
              <Image src="/baton-mascot.png" alt="Baton mascot" fill sizes="112px" className="relative object-contain drop-shadow-[0_12px_8px_rgba(26,78,61,0.15)] animate-[mascot-bob_4s_ease-in-out_infinite]" priority />
            </div>
            <div className="flex items-center gap-2 self-start lg:self-auto rounded-full border border-[#d7e2d7] bg-white/75 px-3.5 py-2 text-xs font-semibold text-[#4e6259] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            All systems in sync
            </div>
          </div>
        </section>
        {/* Overnight Catch-Up: While You Were Away */}
        <WhileYouWereAway
          onActionClick={() => {
            document.getElementById('pending-handoff-queue')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* The Handoff Queue: What needs action (blocked items already surface here per-item) */}
        <HandoffQueue
          items={handoffQueue}
          onAcceptBaton={handleAcceptBaton}
          onCompleteItem={handleCompleteQueueItem}
        />

        {/* Instant AI Memory Search */}
        <ProjectMemorySearch
          timelineEvents={timelineEvents}
          workspaceContext={workspaceContext}
        />

        {/* Can I reach this person right now? */}
        <GlobalTeamPresence
          offices={offices}
          onToggleStatus={handleToggleMemberStatus}
        />

        {/* Book time with a teammate inside your real timezone overlap */}
        <MeetingScheduler
          offices={offices}
          currentUser={currentUser}
        />

        {/* Simple Chronological Activity Stream */}
        <ChronologicalProjectFeed
          events={timelineEvents}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dfe5dc] bg-[#f0f2eb]/90 py-5 text-center text-xs text-[#66736d]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Baton — Seamless 24/7 team handoffs across Tokyo, London, and New York</span>
          <span className="text-slate-400 text-[11px]">Simple • Actionable • Zero status report friction</span>
        </div>
      </footer>

      {/* Interactive Modal */}
      <PassBatonModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        currentUser={currentUser}
        onDispatchHandoff={handleDispatchHandoff}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#243044] text-white shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
