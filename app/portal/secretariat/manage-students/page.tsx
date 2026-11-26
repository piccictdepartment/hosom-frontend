import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Manage Students · Secretariat' };

export default function ManageStudentsPage() {
  return <PortalSection role="secretariat" section="Manage Students" />;
}
