import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Certificates · Director' };

export default function CertificatesPage() {
  return <PortalSection role="director" section="Certificates" />;
}
