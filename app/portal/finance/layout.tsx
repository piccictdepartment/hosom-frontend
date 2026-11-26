import { PortalShell } from '@/components/portal/portal-shell';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="finance">{children}</PortalShell>;
}
