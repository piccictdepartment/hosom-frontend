import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Fees · Student' };

export default function FeesPage() {
  return <PortalSection role="student" section="Fees" />;
}
