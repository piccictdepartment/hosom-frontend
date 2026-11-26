import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Announcements · Head of HOSOM' };

export default function AnnouncementsPage() {
  return <PortalSection role="head-of-hosom" section="Announcements" />;
}
