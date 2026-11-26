import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Management Reviews · Director' };

export default function ManagementReviewsPage() {
  return <PortalSection role="director" section="Management Reviews" />;
}
