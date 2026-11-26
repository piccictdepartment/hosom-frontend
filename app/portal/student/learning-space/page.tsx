import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Learning Space · Student' };

export default function LearningSpacePage() {
  return <PortalSection role="student" section="Learning Space" />;
}
