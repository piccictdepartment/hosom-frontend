import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Course Materials · Media' };

export default function CourseMaterialsPage() {
  return <PortalSection role="media" section="Course Materials" />;
}
