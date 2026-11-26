import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Balances · Finance' };

export default function BalancesPage() {
  return <PortalSection role="finance" section="Balances" />;
}
