import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Users · System Administrator' };

export default function UsersPage() {
  return <PortalSection role="system-admin" section="Users" />;
}
