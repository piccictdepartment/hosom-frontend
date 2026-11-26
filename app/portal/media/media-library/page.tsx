import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Media Library · Media' };

export default function MediaLibraryPage() {
  return <PortalSection role="media" section="Media Library" />;
}
