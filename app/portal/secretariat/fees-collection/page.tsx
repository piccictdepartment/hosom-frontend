import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Fees Collection · Secretariat' };

export default function FeesCollectionPage() {
  return <PortalSection role="secretariat" section="Fees Collection" />;
}
