import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Integrations · System Administrator' };

export default function IntegrationsPage() {
  return <PortalSection role="system-admin" section="Integrations" />;
}
