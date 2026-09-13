export type DesignTheme = 'command' | 'editorial' | 'pulse';

export interface OfficePresence {
  id: string;
  city: string;
  timezone: string;
  utcOffset: number; // e.g. -4 for EDT, +1 for BST, +9 for JST
  code: string;
  workHours: string; // e.g. "9:00 AM – 6:00 PM"
  isCurrentlyWorkHours: boolean;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  city: string;
  avatar: string;
  status: 'working' | 'available' | 'meeting' | 'offline';
  statusText: string;
  timeRemaining?: string;
  currentTask?: string;
}

export interface HandoffItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  project: string;
  title: string;
  owner: string;
  ownerLocation: string;
  recipient: string;
  recipientLocation: string;
  status: 'waiting' | 'pending' | 'in_progress' | 'completed';
  time: string;
  accomplished: string;
  blocked: string;
  nextAction: string;
  sourceType?: 'presentation' | 'document' | 'spreadsheet' | 'campaign' | 'financial';
}

export interface ActiveBlocker {
  id: string;
  project: string;
  waitingOn: string;
  waitingOnRole: string;
  waitingOnLocation: string;
  waitingOnStatus: 'working' | 'available' | 'meeting' | 'offline';
  need: string;
  urgency: 'critical' | 'moderate';
  sinceTime: string;
  unblockActionHint: string;
}

export interface TimelineEvent {
  id: string;
  project: string;
  author: string;
  authorLocation: string;
  authorRole: string;
  type: 'accomplished' | 'blocker' | 'handoff' | 'decision';
  content: string;
  timestamp: string;
  badgeText: string;
}

export interface CollaborationWindow {
  pair: string;
  fromCity: string;
  toCity: string;
  windowLabel: string;
  hoursOverlap: number;
  bestWindow: string;
  note: string;
}

export interface ExamplePreset {
  id: string;
  name: string;
  team: string;
  from: string;
  to: string;
  workDescription: string;
  blockerDescription: string;
  nextDescription: string;
  accomplished: string;
  blocked: string;
  nextAction: string;
}
