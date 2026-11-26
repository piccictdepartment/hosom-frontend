import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Documents · Finance' };

export default function DocumentsPage() {
  return <PortalSection role="finance" section="Documents" />;
}
