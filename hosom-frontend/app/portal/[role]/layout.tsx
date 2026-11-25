import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal-shell';
import { isRoleSlug } from '@/lib/demo-data';
export default async function RoleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ role: string }> }) { const { role } = await params; if (!isRoleSlug(role)) notFound(); return <PortalShell role={role}>{children}</PortalShell>; }
