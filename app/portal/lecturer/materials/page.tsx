import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Materials · Lecturer' };

export default function MaterialsPage() {
  return <PortalSection role="lecturer" section="Materials" />;
}
