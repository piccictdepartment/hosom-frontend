import type { Metadata } from 'next';
import { PublicHeader } from '@/components/public-header';
import { ApplicationFlow } from '@/components/application-flow';
export const metadata: Metadata = { title: 'Admissions', description: 'Explore the HOSOM application process and try an in-memory sample application.' };
export default function AdmissionsPage() { return <><PublicHeader /><ApplicationFlow /></>; }
