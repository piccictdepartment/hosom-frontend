import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'My Courses · Student' };

export default function MyCoursesPage() {
  return <PortalSection role="student" section="My Courses" />;
}
