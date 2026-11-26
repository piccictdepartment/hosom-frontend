import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Results · Student' };

export default function ResultsPage() {
  return <PortalSection role="student" section="Results" />;
}
