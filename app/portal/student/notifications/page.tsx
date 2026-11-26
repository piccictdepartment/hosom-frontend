import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Notifications · Student' };

export default function NotificationsPage() {
  return <PortalSection role="student" section="Notifications" />;
}
