import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Staff Management · Administration' };

export default function StaffManagementPage() {
  return <PortalSection role="administration" section="Staff Management" />;
}
