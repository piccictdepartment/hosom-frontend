import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Academic Performance · Director' };

export default function AcademicPerformancePage() {
  return <PortalSection role="director" section="Academic Performance" />;
}
