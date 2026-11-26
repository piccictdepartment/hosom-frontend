import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Enrolled Students · Lecturer' };

export default function EnrolledStudentsPage() {
  return <PortalSection role="lecturer" section="Enrolled Students" />;
}
