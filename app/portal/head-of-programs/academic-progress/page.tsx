import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Academic Progress · Head of Programs' };

export default function AcademicProgressPage() {
  return <PortalSection role="head-of-programs" section="Academic Progress" />;
}
