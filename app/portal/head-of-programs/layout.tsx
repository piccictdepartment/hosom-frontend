import { PortalShell } from '@/components/portal/portal-shell';

export default function HeadOfProgramsLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="head-of-programs">{children}</PortalShell>;
}
