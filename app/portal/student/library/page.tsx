import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Library · Student' };

export default function LibraryPage() {
  return <PortalSection role="student" section="Library" />;
}
