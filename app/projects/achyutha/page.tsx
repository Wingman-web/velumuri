import type { Metadata } from 'next';
import { AchyuthaExperience } from '@/components/achyutha-experience';

export const metadata: Metadata = {
  title: 'Achyutha | Velumuri Infra',
  description: 'Achyutha — a residence shaped by light, landscape and a more considered way to come home, near Morampudi Junction, Rajamahendravaram.',
};

export default function Page() {
  return <AchyuthaExperience />;
}
