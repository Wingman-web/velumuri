'use client';

import { useEnquiryModal } from '@/components/enquiry-modal';

export function EnquiryTab() {
  const openEnquiryModal = useEnquiryModal();
  return (
    <button type="button" className="enquiry-tab" onClick={openEnquiryModal} aria-label="Open the enquiry form to schedule a visit">
      <span>Enquire Now</span>
    </button>
  );
}
