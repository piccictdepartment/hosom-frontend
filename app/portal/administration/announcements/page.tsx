import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · Administration' };

export default function AnnouncementsPage() {
  return <PortalSection role="administration" section="Announcements" />;
}
