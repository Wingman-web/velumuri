import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us | Achyutha',
  description: 'Get in touch with Achyutha — ask about ongoing projects, schedule a site visit, or find answers to common questions about buying a home in Rajahmundry.',
};

export default function Page() {
  return <ContactPage />;
}
