import { PortalShell } from '@/components/portal/portal-shell';

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="system-admin">{children}</PortalShell>;
}
