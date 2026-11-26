import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Lecturers · Head of Programs' };

export default function LecturersPage() {
  return <PortalSection role="head-of-programs" section="Lecturers" />;
}
