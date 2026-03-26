import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design — Ryyan Safar',
  description: 'Design work. Stuff I shipped when I should have been studying.',
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
