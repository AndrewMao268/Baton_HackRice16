import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Baton — Global Team Handoff & Coordination',
  description: 'Global team handoff and coordination platform answering what happened, what is blocked, who needs to act, and what happens next across time zones.',
  openGraph: {
    title: 'Baton — Global Team Handoff & Coordination',
    description: 'Global team handoff and coordination platform answering what happened, what is blocked, who needs to act, and what happens next across time zones.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baton — Global Team Handoff & Coordination',
    description: 'Global team handoff and coordination platform answering what happened, what is blocked, who needs to act, and what happens next across time zones.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
