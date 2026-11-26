import { PortalShell } from '@/components/portal/portal-shell';

export default function HeadOfHosomLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="head-of-hosom">{children}</PortalShell>;
}
