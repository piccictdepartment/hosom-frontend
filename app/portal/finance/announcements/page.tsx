import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · Finance' };

export default function AnnouncementsPage() {
  return <PortalSection role="finance" section="Announcements" />;
}
