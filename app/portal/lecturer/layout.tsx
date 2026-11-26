import { PortalShell } from '@/components/portal/portal-shell';

export default function LecturerLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="lecturer">{children}</PortalShell>;
}
