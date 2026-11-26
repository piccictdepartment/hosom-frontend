import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · Lecturer' };

export default function AnnouncementsPage() {
  return <PortalSection role="lecturer" section="Announcements" />;
}
