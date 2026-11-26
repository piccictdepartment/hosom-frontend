import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-playfair' });
import { AuthProvider } from '@/components/providers/auth-provider';
import { WorkflowProvider } from '@/components/providers/workflow-provider';
import './workflows.css';
import './public-content.css';
import '@/components/portal/role-overview.css';
import '@/components/portal/management-content.css';
import '@/components/portal/account-content.css';
import '@/components/portal/learning-content.css';
import '@/components/student/student-experience.css';
import '@/components/student/student-assessments.css';
import '@/components/student/student-results.css';
import '@/components/student/student-finance.css';
import '@/components/student/student-learning-overview.css';
import '@/components/student/student-overview.css';
import '@/components/student/student-courses.css';
import '@/components/lecturer/lecturer-overview.css';
import '@/components/lecturer/lecturer-courses.css';
import '@/components/lecturer/lecturer-materials.css';
import '@/components/lecturer/lecturer-pages.css';
import '@/components/portal/events-workspace.css';

export const metadata: Metadata = { title: { default: 'HOSOM | Hope School of Ministry', template: '%s | HOSOM' }, description: 'Hope School of Ministry e-learning and academic management interface.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <WorkflowProvider>{children}</WorkflowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
