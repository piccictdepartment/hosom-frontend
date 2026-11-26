import { PortalShell } from '@/components/portal/portal-shell';

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="director">{children}</PortalShell>;
}
