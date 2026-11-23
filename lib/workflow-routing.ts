import type { RoleSlug } from './demo-data';
export function supportsWorkflow(role: RoleSlug, section: string) {
  if (['Announcements','Course Announcements','Notifications','Events','Operations'].includes(section)) return true;
  if (['Requisitions','Requisition'].includes(section)) return true;
  if (role === 'student' && ['Learning Space','Library','Assessments','Results','Fees'].includes(section)) return true;
  if (role === 'lecturer' && ['Materials','Assignments','Quizzes & Exams','Submissions','Marks'].includes(section)) return true;
  if (role === 'secretariat' && ['Applications','Admissions','Enrolment','Results Publication','Fees Collection'].includes(section)) return true;
  if (role === 'head-of-programs' && ['Admission Approvals','Exam Approval','Results Approval'].includes(section)) return true;
  if (role === 'finance' && ['Payments','Receipts','Fee Accounts','Balances'].includes(section)) return true;
  return false;
}
