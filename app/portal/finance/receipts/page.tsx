import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Receipts · Finance' };

export default function ReceiptsPage() {
  return <PortalSection role="finance" section="Receipts" />;
}
