import { announcements, applications, assessments, courses, payments, portalHref, programmes, roles, type RoleSlug } from './demo-data';

// This boundary can later be replaced with calls to the separate backend.
// Today every result is deterministic demo data and there are no mutations.
export function getPortalOverview(role: RoleSlug) {
  const metrics: Record<RoleSlug, { label: string; value: string; note: string }[]> = {
    student: [{ label: 'Enrolled courses', value: '03', note: 'This semester' }, { label: 'Due this week', value: '02', note: 'Assessments' }, { label: 'Fee balance', value: 'MWK 125,000', note: '2026 · Semester 2' }],
    lecturer: [{ label: 'Assigned courses', value: '03', note: 'Active offerings' }, { label: 'Submissions to mark', value: '18', note: 'Across your courses' }, { label: 'Upcoming classes', value: '02', note: 'This week' }],
    secretariat: [{ label: 'New applications', value: '12', note: 'Awaiting review' }, { label: 'Admissions pending', value: '05', note: 'Ready for action' }, { label: 'Active students', value: '426', note: 'Across programmes' }],
    finance: [{ label: 'Active fee accounts', value: '248', note: 'Current semester' }, { label: 'Collected this month', value: 'MWK 1.8m', note: 'Demo total' }, { label: 'Balances overdue', value: '36', note: 'Require follow up' }],
    administration: [{ label: 'Records to review', value: '12', note: 'Across departments' }, { label: 'Active staff', value: '38', note: 'Institution wide' }, { label: 'Pending approvals', value: '04', note: 'Need attention' }],
    'head-of-programs': [{ label: 'Active programmes', value: '08', note: 'Academic catalogue' }, { label: 'Course offerings', value: '32', note: 'Current semester' }, { label: 'Results to review', value: '05', note: 'Awaiting approval' }],
    'head-of-hosom': [{ label: 'Active students', value: '426', note: 'Current semester' }, { label: 'Requisitions', value: '04', note: 'Awaiting review' }, { label: 'Reports', value: '08', note: 'Available views' }],
    director: [{ label: 'Active students', value: '426', note: 'Institution wide' }, { label: 'Active programmes', value: '08', note: 'Academic catalogue' }, { label: 'Approvals', value: '03', note: 'Need attention' }],
    media: [{ label: 'Media resources', value: '14', note: 'In library' }, { label: 'Published', value: '08', note: 'Available to students' }, { label: 'Drafts', value: '06', note: 'In preparation' }],
    'system-admin': [{ label: 'User accounts', value: '512', note: 'Demo directory' }, { label: 'Active courses', value: '32', note: 'Current semester' }, { label: 'Open tasks', value: '07', note: 'System checks' }],
  };
  const priority: Record<RoleSlug, string[]> = {
    student: ['Continue Biblical Interpretation', 'Review upcoming assessments', 'Check your timetable'],
    lecturer: ['Mark 18 submitted assessments', 'Prepare next live class', 'Review course materials'],
    secretariat: ['Review new applications', 'Publish approved admissions', 'Confirm enrolment cohort'],
    finance: ['Review pending payments', 'Reconcile fee accounts', 'Prepare collection report'],
    administration: ['Review records', 'Process staff requests', 'Review requisitions'],
    'head-of-programs': ['Approve examination schedules', 'Review submitted results', 'Review admissions list'],
    'head-of-hosom': ['Review forwarded requisitions', 'Read institutional reports', 'Check academic updates'],
    director: ['Review approvals', 'Read finance summary', 'Check academic performance'],
    media: ['Review draft resources', 'Check published materials', 'Organise media library'],
    'system-admin': ['Review user access', 'Check audit trail', 'Review system settings'],
  };
  return { metrics: metrics[role], priority: priority[role], announcements, courses, role: roles[role], portalHref };
}

export type DemoRow = Record<string, string>;
export function getSectionRows(role: RoleSlug, section: string): { columns: string[]; rows: DemoRow[]; description: string } {
  const normalized = section.toLowerCase();
  if (normalized.includes('course') || normalized.includes('programme')) {
    const rows = normalized.includes('programme') ? programmes.map(p => ({ Code: p.code, Name: p.name, Type: p.type, Duration: p.duration, Status: p.status })) : courses.map(c => ({ Code: c.code, Course: c.name, Lecturer: c.lecturer, Students: String(c.students), Status: c.status }));
    return { columns: Object.keys(rows[0]), rows, description: 'Explore the current academic catalogue and course activity.' };
  }
  if (normalized.includes('assessment') || normalized.includes('assignment') || normalized.includes('exam') || normalized.includes('submission') || normalized.includes('mark') || normalized.includes('result')) {
    const rows = assessments.map(a => ({ Assessment: a.title, Course: a.course, Type: a.type, Due: a.due, Status: a.status }));
    return { columns: Object.keys(rows[0]), rows, description: 'Review academic activities and their current demo status.' };
  }
  if (normalized.includes('application') || normalized.includes('admission') || normalized.includes('student') || normalized.includes('enrolment')) {
    const rows = applications.map(a => ({ Reference: a.id, Name: a.name, Programme: a.programme, Date: a.date, Status: a.status }));
    return { columns: Object.keys(rows[0]), rows, description: 'Follow candidates from application through admission and enrolment.' };
  }
  if (normalized.includes('finance') || normalized.includes('payment') || normalized.includes('fee') || normalized.includes('receipt') || normalized.includes('balance')) {
    const rows = payments.map(p => ({ Reference: p.id, Student: p.name, Period: p.period, Amount: p.amount, Status: p.status }));
    return { columns: Object.keys(rows[0]), rows, description: 'A sample view of fee accounts and payment activity. No transactions occur.' };
  }
  if (normalized.includes('announcement') || normalized.includes('notification') || normalized.includes('communication') || normalized.includes('event')) {
    const rows = announcements.map(a => ({ Title: a.title, From: a.source, Date: a.date, Status: a.status }));
    return { columns: Object.keys(rows[0]), rows, description: 'Institutional and course updates visible in the demo.' };
  }
  const rows = [
    { Reference: 'HOSOM-001', Item: `${section} overview`, Owner: roles[role].person, Updated: '12 Nov 2026', Status: 'Active' },
    { Reference: 'HOSOM-002', Item: `${section} review`, Owner: 'Academic office', Updated: '10 Nov 2026', Status: 'Pending' },
  ];
  return { columns: Object.keys(rows[0]), rows, description: `Sample ${section.toLowerCase()} records for the ${roles[role].label} workspace.` };
}
