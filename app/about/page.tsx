import type { Metadata } from 'next';
import { AboutPage } from '@/components/about-page';

export const metadata: Metadata = {
  title: 'About Us | Achyutha',
  description: 'Achyutha — building trusted homes in Rajahmundry since 2008. Meet our chairman, our mission and vision, and why customers across 16 completed projects choose us.',
};

export default function Page() {
  return <AboutPage />;
}
