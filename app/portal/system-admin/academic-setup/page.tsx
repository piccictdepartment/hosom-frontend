import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Academic Setup · System Administrator' };

export default function AcademicSetupPage() {
  return <PortalSection role="system-admin" section="Academic Setup" />;
}
