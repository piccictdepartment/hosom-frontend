import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Quizzes & Exams · Lecturer' };

export default function QuizzesAndExamsPage() {
  return <PortalSection role="lecturer" section="Quizzes & Exams" />;
}
