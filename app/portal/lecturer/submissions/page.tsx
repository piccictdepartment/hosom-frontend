import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Submissions · Lecturer' };

export default function SubmissionsPage() {
  return <PortalSection role="lecturer" section="Submissions" />;
}
