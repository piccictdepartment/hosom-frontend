import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Marks · Lecturer' };

export default function MarksPage() {
  return <PortalSection role="lecturer" section="Marks" />;
}
