import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Documents · Secretariat' };

export default function DocumentsPage() {
  return <PortalSection role="secretariat" section="Documents" />;
}
