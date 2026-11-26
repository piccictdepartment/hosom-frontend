import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · System Administrator' };

export default function AnnouncementsPage() {
  return <PortalSection role="system-admin" section="Announcements" />;
}
