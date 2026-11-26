import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Enrolment Monitoring · Head of Programs' };

export default function EnrolmentMonitoringPage() {
  return <PortalSection role="head-of-programs" section="Enrolment Monitoring" />;
}
