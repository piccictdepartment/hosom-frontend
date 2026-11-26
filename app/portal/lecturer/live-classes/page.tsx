import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Live Classes · Lecturer' };

export default function LiveClassesPage() {
  return <PortalSection role="lecturer" section="Live Classes" />;
}
