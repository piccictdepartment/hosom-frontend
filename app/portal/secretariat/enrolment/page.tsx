import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Enrolment · Secretariat' };

export default function EnrolmentPage() {
  return <PortalSection role="secretariat" section="Enrolment" />;
}
