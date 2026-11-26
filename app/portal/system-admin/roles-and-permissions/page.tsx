import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Roles & Permissions · System Administrator' };

export default function RolesAndPermissionsPage() {
  return <PortalSection role="system-admin" section="Roles & Permissions" />;
}
