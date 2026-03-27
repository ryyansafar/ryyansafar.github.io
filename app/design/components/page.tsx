import type { Metadata } from 'next';
import { ComponentsClient } from './ComponentsClient';

export const metadata: Metadata = {
  title: 'Components — Ryyan Safar',
  description: 'UI components by Ryyan Safar. Spring cursor with physics-based motion blur. Copy-paste ready, zero dependencies.',
};

export default function ComponentsPage() {
  return <ComponentsClient />;
}
