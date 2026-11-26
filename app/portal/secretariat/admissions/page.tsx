import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Admissions · Secretariat' };

export default function AdmissionsPage() {
  return <PortalSection role="secretariat" section="Admissions" />;
}
