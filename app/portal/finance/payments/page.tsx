import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Payments · Finance' };

export default function PaymentsPage() {
  return <PortalSection role="finance" section="Payments" />;
}
