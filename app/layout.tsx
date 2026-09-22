import type { Metadata } from 'next';
import './globals.css';
import './velumuri-reference/variables-v4.css';
import './velumuri-reference/base-v4.css';
import './velumuri-reference/layout-v4.css';
import './velumuri-reference/components-v4.css';
import './velumuri-reference/animations-v4.css';
import './brand.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MotionProvider } from '@/components/motion-provider';
import { ScrollBadge } from '@/components/scroll-badge';
import { EnquiryModalProvider } from '@/components/enquiry-modal';
import { EnquiryTab } from '@/components/enquiry-tab';

export const metadata: Metadata = {
  title: 'Achyutha | Living, considered',
  description: 'Thoughtfully crafted residences in Rajamahendravaram, Andhra Pradesh.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <EnquiryModalProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <ScrollBadge />
            <EnquiryTab />
          </EnquiryModalProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
