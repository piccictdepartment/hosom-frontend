import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Transcript · Student' };

export default function TranscriptPage() {
  return <PortalSection role="student" section="Transcript" />;
}
