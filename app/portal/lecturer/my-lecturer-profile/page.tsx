import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'My Lecturer Profile · Lecturer' };

export default function MyLecturerProfilePage() {
  return <PortalSection role="lecturer" section="My Lecturer Profile" />;
}
