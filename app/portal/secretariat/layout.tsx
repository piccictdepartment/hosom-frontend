import { PortalShell } from '@/components/portal/portal-shell';

export default function SecretariatLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="secretariat">{children}</PortalShell>;
}
