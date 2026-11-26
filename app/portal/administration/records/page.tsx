import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Records · Administration' };

export default function RecordsPage() {
  return <PortalSection role="administration" section="Records" />;
}
