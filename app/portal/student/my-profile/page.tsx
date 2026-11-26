import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'My Profile · Student' };

export default function MyProfilePage() {
  return <PortalSection role="student" section="My Profile" />;
}
