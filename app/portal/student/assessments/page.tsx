import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Assessments · Student' };

export default function AssessmentsPage() {
  return <PortalSection role="student" section="Assessments" />;
}
