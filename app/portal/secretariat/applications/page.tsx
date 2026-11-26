import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Applications · Secretariat' };

export default function ApplicationsPage() {
  return <PortalSection role="secretariat" section="Applications" />;
}
