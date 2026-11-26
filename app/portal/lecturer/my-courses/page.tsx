import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'My Courses · Lecturer' };

export default function MyCoursesPage() {
  return <PortalSection role="lecturer" section="My Courses" />;
}
