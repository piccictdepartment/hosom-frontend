import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Fee Accounts · Finance' };

export default function FeeAccountsPage() {
  return <PortalSection role="finance" section="Fee Accounts" />;
}
