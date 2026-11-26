import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Courses · Head of Programs' };

export default function CoursesPage() {
  return <PortalSection role="head-of-programs" section="Courses" />;
}
