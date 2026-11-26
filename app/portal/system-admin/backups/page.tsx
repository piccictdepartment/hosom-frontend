import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Backups · System Administrator' };

export default function BackupsPage() {
  return <PortalSection role="system-admin" section="Backups" />;
}
