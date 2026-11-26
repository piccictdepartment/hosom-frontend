import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Staff Management · System Administrator' };

export default function StaffManagementPage() {
  return <PortalSection role="system-admin" section="Staff Management" />;
}
