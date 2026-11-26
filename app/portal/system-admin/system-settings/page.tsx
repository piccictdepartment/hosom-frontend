import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'System Settings · System Administrator' };

export default function SystemSettingsPage() {
  return <PortalSection role="system-admin" section="System Settings" />;
}
