import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Assignments · Lecturer' };

export default function AssignmentsPage() {
  return <PortalSection role="lecturer" section="Assignments" />;
}
