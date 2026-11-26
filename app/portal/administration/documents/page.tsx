import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Documents · Administration' };

export default function DocumentsPage() {
  return <PortalSection role="administration" section="Documents" />;
}
