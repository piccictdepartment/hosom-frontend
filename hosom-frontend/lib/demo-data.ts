/** Static presentation data. No browser persistence, credentials or backend calls. */
export const programmes = [
  { code: 'CM-01', name: 'Certificate in Ministry', type: 'Certificate', duration: '1 year', description: 'A foundation for emerging ministry leaders, combining scripture, practical discipleship and ministry formation.', status: 'Open for applications' },
  { code: 'DT-02', name: 'Diploma in Theology', type: 'Diploma', duration: '2 years', description: 'Structured theological education with blended learning, guided reflection and supervised practice.', status: 'Open for applications' },
  { code: 'BM-04', name: 'Bachelor of Ministry', type: 'Degree', duration: '4 years', description: 'An in-depth pathway for leaders preparing for sustained pastoral and community ministry.', status: 'Applications opening soon' },
] as const;

export const roles = {
  student: { label: 'Student', person: 'Thoko Banda', id: 'HOSOM/2026/014', subtitle: 'Diploma in Theology', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'My Profile'] },
    { label: 'LEARNING', items: ['My Courses', 'Learning Space', 'Assessments', 'Timetable', 'Library'] },
    { label: 'ACADEMIC RECORDS', items: ['Results', 'Transcript'] },
    { label: 'STUDENT SERVICES', items: ['Fees', 'Notifications'] },
  ] },
  lecturer: { label: 'Lecturer', person: 'Dr. Daniel Phiri', id: 'HOSOM/LEC/001', subtitle: 'Teaching workspace', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'My Courses', 'My Lecturer Profile'] },
    { label: 'TEACHING', items: ['Materials', 'Live Classes', 'Enrolled Students'] },
    { label: 'ASSESSMENT', items: ['Assignments', 'Quizzes & Exams', 'Submissions', 'Marks'] },
    { label: 'COMMUNICATION', items: ['Announcements', 'Notifications'] },
  ] },
  secretariat: { label: 'Secretariat', person: 'Mary Tembo', id: 'HOSOM/SEC/001', subtitle: 'Student administration', groups: [
    { label: 'WORKSPACE', items: ['Overview'] },
    { label: 'STUDENT ADMINISTRATION', items: ['Applications', 'Admissions', 'Manage Students', 'Enrolment', 'Results Publication', 'Fees Collection'] },
    { label: 'RECORDS & REPORTS', items: ['Documents', 'Reports', 'Requisition'] },
    { label: 'COMMUNICATION', items: ['Operations', 'Events', 'Announcements', 'Mailer'] },
  ] },
  finance: { label: 'Finance', person: 'Peter Mwale', id: 'HOSOM/FIN/001', subtitle: 'Financial operations', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'FINANCIAL OPERATIONS', items: ['Fee Accounts', 'Requisition', 'Receipts', 'Payments', 'Balances'] },
    { label: 'INSIGHTS', items: ['Reports', 'Documents', 'Announcements', 'Events'] },
  ] },
  administration: { label: 'Administration', person: 'Administration Team', id: 'HOSOM/ADM/001', subtitle: 'Institutional operations', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'OPERATIONS', items: ['Approvals', 'Staff Management', 'Records', 'Documents', 'Requisitions', 'Operations', 'Events', 'Announcements'] },
    { label: 'INSIGHTS', items: ['Reports'] },
  ] },
  'head-of-programs': { label: 'Head of Programs', person: 'Ruth Mbewe', id: 'HOSOM/HOP/001', subtitle: 'Academic management', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'ACADEMIC SETUP', items: ['Programmes', 'Courses', 'Lecturers', 'Enrolment Monitoring', 'Assessment Monitoring', 'Academic Progress'] },
    { label: 'APPROVALS', items: ['Admission Approvals', 'Approvals', 'Exam Approval', 'Results Approval', 'Requisitions'] },
    { label: 'INSIGHTS & COMMUNICATION', items: ['Reports', 'Operations', 'Events', 'Announcements'] },
  ] },
  'head-of-hosom': { label: 'Head of HOSOM', person: 'Head of HOSOM', id: 'HOSOM/HEAD/001', subtitle: 'School leadership', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'LEADERSHIP', items: ['Reports', 'Requisitions', 'Operations', 'Events', 'Announcements'] },
  ] },
  director: { label: 'Director / Chancellor', person: 'Samuel Phiri', id: 'HOSOM/DIR/001', subtitle: 'Executive oversight', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'OVERSIGHT', items: ['Approvals', 'Academic Performance', 'Finance Summary', 'Admissions & Students', 'Programmes', 'Certificates', 'Management Reviews', 'Requisitions'] },
    { label: 'INSIGHTS & COMMUNICATION', items: ['Reports', 'Operations', 'Events', 'Announcements'] },
  ] },
  media: { label: 'Media', person: 'Media Officer', id: 'HOSOM/ICT/001', subtitle: 'Learning media', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'RESOURCES', items: ['Media Library', 'Course Materials', 'Announcements', 'Events'] },
  ] },
  'system-admin': { label: 'System Administrator', person: 'System Administrator', id: 'HOSOM/SYS/001', subtitle: 'Platform administration', groups: [
    { label: 'WORKSPACE', items: ['Overview', 'Mailer'] },
    { label: 'MANAGEMENT', items: ['Users', 'Staff Management', 'Roles & Permissions', 'Programmes', 'Courses', 'Academic Setup'] },
    { label: 'SYSTEM', items: ['Security & Sessions', 'Audit Trail', 'Integrations', 'Backups', 'System Settings', 'System Reports'] },
    { label: 'COMMUNICATION', items: ['Announcements', 'Events'] },
  ] },
} as const;
export type RoleSlug = keyof typeof roles;
export function isRoleSlug(value: string): value is RoleSlug { return Object.hasOwn(roles, value); }
export function sectionsFor(role: RoleSlug): string[] { return roles[role].groups.flatMap(group => [...group.items]); }
export function slugify(value: string) { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
export function sectionFor(role: RoleSlug, slug: string) { return sectionsFor(role).find(item => slugify(item) === slug); }
export function portalHref(role: RoleSlug, section = 'Overview') { return `/portal/${role}/${slugify(section)}`; }

export const courses = [
  { code: 'BI101', name: 'Biblical Interpretation', lecturer: 'Dr. Daniel Phiri', progress: 72, unit: 'Foundations of interpretation', students: 38, status: 'In progress' },
  { code: 'TH201', name: 'Foundations of Theology', lecturer: 'Dr. Daniel Phiri', progress: 48, unit: 'Theology and the church', students: 42, status: 'In progress' },
  { code: 'MN202', name: 'Ministry Leadership', lecturer: 'Rev. Esther Banda', progress: 91, unit: 'Leadership in practice', students: 31, status: 'In progress' },
];
export const lecturerTeachingCourses = ['TH201', 'MN202', 'BI101'].map(code => ({
  ...courses.find(course => course.code === code)!,
  cohort: 'May 2026',
  students: 3,
  status: 'Active',
}));
export const classSessions = [
  { id: 'CLS-01', course: 'TH201', title: 'Foundations of Theology · Weekly class', day: 'Wednesday', date: '18 Nov 2026', time: '09:00–10:30', lecturer: 'Dr. Daniel Phiri', venue: 'Online classroom', status: 'Scheduled', url: '' },
  { id: 'CLS-02', course: 'MN202', title: 'Ministry Leadership · Seminar', day: 'Thursday', date: '19 Nov 2026', time: '14:00–15:30', lecturer: 'Rev. Esther Banda', venue: 'Online classroom', status: 'Scheduled', url: '' },
  { id: 'CLS-03', course: 'BI101', title: 'Biblical Interpretation · Workshop', day: 'Monday', date: '23 Nov 2026', time: '10:00–11:30', lecturer: 'Dr. Daniel Phiri', venue: 'HOSOM learning room', status: 'Scheduled', url: '' },
];
export const assessments = [
  { title: 'Biblical Interpretation · Reflection essay', course: 'BI101', type: 'Assignment', due: '24 Nov 2026', status: 'Open' },
  { title: 'Foundations of Theology · Unit quiz', course: 'TH201', type: 'Quiz', due: '28 Nov 2026', status: 'Open' },
  { title: 'Ministry Leadership · Written exam', course: 'MN202', type: 'Exam', due: '5 Dec 2026', status: 'Scheduled' },
];
export const announcements = [
  { title: 'Semester 2 academic calendar published', source: 'Academic office', date: '12 Nov 2026', status: 'New' },
  { title: 'New study guide for Biblical Interpretation', source: 'Dr. Daniel Phiri', date: '10 Nov 2026', status: 'Course' },
  { title: 'Student support hours this week', source: 'Secretariat', date: '8 Nov 2026', status: 'Notice' },
];
export const applications = [
  { id: 'APP-2026-104', name: 'Mphatso Moyo', programme: 'Diploma in Theology', date: '14 Nov 2026', status: 'Under review' },
  { id: 'APP-2026-103', name: 'Lumbani Chirwa', programme: 'Certificate in Ministry', date: '12 Nov 2026', status: 'Selected' },
  { id: 'APP-2026-102', name: 'Chikondi Banda', programme: 'Diploma in Theology', date: '9 Nov 2026', status: 'Admitted' },
];
export const payments = [
  { id: 'PAY-4821', name: 'Thoko Banda', period: '2026 · Semester 2', amount: 'MWK 75,000', status: 'Confirmed' },
  { id: 'PAY-4817', name: 'Chisomo Phiri', period: '2026 · Semester 2', amount: 'MWK 50,000', status: 'Pending' },
  { id: 'PAY-4809', name: 'Blessings Mbewe', period: '2026 · Semester 2', amount: 'MWK 100,000', status: 'Confirmed' },
];
