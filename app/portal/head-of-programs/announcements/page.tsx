import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · Head of Programs' };

export default function AnnouncementsPage() {
  return <PortalSection role="head-of-programs" section="Announcements" />;
}
