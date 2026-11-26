import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Courses · System Administrator' };

export default function CoursesPage() {
  return <PortalSection role="system-admin" section="Courses" />;
}
