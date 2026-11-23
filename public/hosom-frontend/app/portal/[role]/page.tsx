import { redirect, notFound } from 'next/navigation';
import { isRoleSlug, portalHref } from '@/lib/demo-data';
export default async function RolePage({ params }: { params: Promise<{ role: string }> }) { const { role } = await params; if (!isRoleSlug(role)) notFound(); redirect(portalHref(role)); }
