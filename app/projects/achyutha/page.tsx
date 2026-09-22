import { permanentRedirect } from 'next/navigation';

// Achyutha is now the homepage — keep the old project URL working for
// any existing links by sending it there permanently (308).
export default function Page() {
  permanentRedirect('/');
}
