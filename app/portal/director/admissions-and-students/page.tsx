import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Admissions & Students · Director' };

export default function AdmissionsAndStudentsPage() {
  return <PortalSection role="director" section="Admissions & Students" />;
}
