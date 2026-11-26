import { PortalShell } from '@/components/portal/portal-shell';

export default function AdministrationLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="administration">{children}</PortalShell>;
}
