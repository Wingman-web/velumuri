import type { Metadata } from 'next';
import { AchyuthaExperience } from '@/components/achyutha-experience';

export const metadata: Metadata = {
  title: 'Achyutha | Velumuri Infra',
  description: 'Achyutha — a residence shaped by light, landscape and a more considered way to come home, near Morampudi Junction, Rajamahendravaram.',
};

// The Achyutha experience is the site's homepage. The old video-led
// landing page still lives in components/velumuri-home.tsx, unrouted.
export default function Home() {
  return <AchyuthaExperience />;
}
