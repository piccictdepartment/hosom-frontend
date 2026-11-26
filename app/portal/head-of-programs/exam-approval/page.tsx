import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Exam Approval · Head of Programs' };

export default function ExamApprovalPage() {
  return <PortalSection role="head-of-programs" section="Exam Approval" />;
}
