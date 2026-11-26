import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Notifications · Lecturer' };

export default function NotificationsPage() {
  return <PortalSection role="lecturer" section="Notifications" />;
}
