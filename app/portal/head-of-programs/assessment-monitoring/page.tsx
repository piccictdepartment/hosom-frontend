import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Assessment Monitoring · Head of Programs' };

export default function AssessmentMonitoringPage() {
  return <PortalSection role="head-of-programs" section="Assessment Monitoring" />;
}
