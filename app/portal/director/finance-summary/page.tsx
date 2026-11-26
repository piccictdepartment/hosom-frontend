import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Finance Summary · Director' };

export default function FinanceSummaryPage() {
  return <PortalSection role="director" section="Finance Summary" />;
}
