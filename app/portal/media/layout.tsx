import { PortalShell } from '@/components/portal/portal-shell';

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="media">{children}</PortalShell>;
}
