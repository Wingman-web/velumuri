import type { Metadata } from 'next';
import { NriPage } from '@/components/nri-page';

export const metadata: Metadata = {
  title: 'NRI Services | Achyutha',
  description: 'Achyutha’s NRI desk handles home loan assistance, documentation & registration, secure FEMA-compliant payments and dedicated support — so you can buy a home in Rajahmundry from anywhere in the world.',
};

export default function Page() {
  return <NriPage />;
}
