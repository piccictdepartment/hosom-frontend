'use client';
import Link from 'next/link';
import { courses, portalHref, roles, type RoleSlug } from '@/lib/demo-data';
import { useWorkflows } from '@/components/providers/workflow-provider';

type Metric = { label: string; value: string | number; note: string; target: string };
type Quick = { title: string; detail: string; target: string };
const money = (value: number) => `MWK ${value.toLocaleString('en-GB')}`;
const roleCopy: Record<RoleSlug, { kicker: string; title: string; copy: string }> = {
  student: {
    kicker: 'STUDENT PORTAL',
    title: 'Your learning journey, clearly organised.',
    copy: 'Continue your studies, review assessments and stay connected with your HOSOM community.',
  },
  lecturer: {
    kicker: 'LECTURER PORTAL',
    title: 'Your teaching workspace, ready for the day.',
    copy: 'Coordinate course delivery, support your students and keep assessment work moving.',
  },
  secretariat: {
    kicker: 'ACADEMIC ADMINISTRATION',
    title: 'Support every student. Coordinate every step.',
    copy: 'A focused view of applications, admission decisions, enrolment and student records.',
  },
  finance: {
    kicker: 'FINANCIAL OPERATIONS',
    title: 'Clear accounts. Confident decisions.',
    copy: 'Monitor student fees, confirm collections and follow up outstanding balances.',
  },
  administration: {
    kicker: 'INSTITUTIONAL OPERATIONS',
    title: 'Keep every department moving.',
    copy: 'Review records, coordinate staff and track institutional requests.',
  },
  'head-of-programs': {
    kicker: 'ACADEMIC LEADERSHIP',
    title: 'Guide programmes from planning to results.',
    copy: 'Oversee course offerings, admissions, examinations and academic progress.',
  },
  'head-of-hosom': {
    kicker: 'HEAD OF HOSOM',
    title: 'School oversight at a glance.',
    copy: 'Keep institutional reports, requisitions and academic priorities in view.',
  },
  director: {
    kicker: 'EXECUTIVE OVERSIGHT',
    title: 'A clear view of the whole institution.',
    copy: 'Follow student outcomes, financial performance and decisions across HOSOM.',
  },
  media: {
    kicker: 'MEDIA WORKSPACE',
    title: 'Resources ready for every learner.',
    copy: 'Prepare and organise learning media for accessible course delivery.',
  },
  'system-admin': {
    kicker: 'SYSTEM ADMINISTRATION',
    title: 'Keep the platform ready for learning.',
    copy: 'Manage accounts, course setup, access and system oversight.',
  },
};
function Panel({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ro-panel">
      <div className="ro-panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {href && <Link href={href}>View all →</Link>}
      </div>
      {children}
    </section>
  );
}
function LinkRow({
  title,
  detail,
  href,
  side,
}: {
  title: string;
  detail: string;
  href: string;
  side?: string;
}) {
  return (
    <Link className="ro-link-row" href={href}>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span>{side || '→'}</span>
    </Link>
  );
}
function QuickLinks({ role, items }: { role: RoleSlug; items: Quick[] }) {
  return (
    <div className="ro-quick-grid">
      {items.map((item, index) => (
        <Link href={portalHref(role, item.target)} key={item.title}>
          <span className="ro-quick-icon">{['▤', '◫', '◇', '◎'][index % 4]}</span>
          <strong>{item.title}</strong>
          <small>{item.detail}</small>
          <span className="ro-quick-arrow">↗</span>
        </Link>
      ))}
    </div>
  );
}
function Metrics({ role, items }: { role: RoleSlug; items: Metric[] }) {
  return (
    <div className="ro-metrics">
      {items.map((item) => (
        <Link key={item.label} href={portalHref(role, item.target)}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.note}</small>
          <i>↗</i>
        </Link>
      ))}
    </div>
  );
}

export function RoleOverview({ role }: { role: RoleSlug }) {
  const { state } = useWorkflows();
  const copy = roleCopy[role];
  const studentBalance = Math.max(
    0,
    125000 -
      state.payments
        .filter((p) => p.status === 'Confirmed')
        .reduce((total, p) => total + p.amount, 0),
  );
  const pendingSubmissions = state.submissions.filter((s) => s.status === 'Submitted');
  const pendingCandidates = state.candidates.filter((c) => c.status === 'Submitted');
  const publishedAssessments = state.assessments.filter((a) => a.status === 'Published');
  const metrics: Record<RoleSlug, Metric[]> = {
    student: [
      { label: 'Enrolled courses', value: '03', note: '2026 · Semester 2', target: 'My Courses' },
      {
        label: 'Available assessments',
        value: publishedAssessments.length,
        note: 'Assignments, quizzes & exams',
        target: 'Assessments',
      },
      {
        label: 'Fee balance',
        value: money(studentBalance),
        note: 'Current academic period',
        target: 'Fees',
      },
    ],
    lecturer: [
      {
        label: 'Assigned courses',
        value: '03',
        note: 'Active teaching allocations',
        target: 'My Courses',
      },
      {
        label: 'Submissions to mark',
        value: pendingSubmissions.length,
        note: 'Awaiting your feedback',
        target: 'Submissions',
      },
      {
        label: 'Published resources',
        value: state.resources.filter((r) => r.status === 'Published').length,
        note: 'Available to students',
        target: 'Materials',
      },
      {
        label: 'Exams to schedule',
        value: state.assessments.filter((a) => a.type === 'Exam' && a.status === 'Approved').length,
        note: 'Approved by academic office',
        target: 'Quizzes & Exams',
      },
    ],
    secretariat: [
      {
        label: 'Applications received',
        value: state.candidates.length,
        note: 'Current demo register',
        target: 'Applications',
      },
      {
        label: 'Awaiting selection',
        value: pendingCandidates.length,
        note: 'New applications',
        target: 'Applications',
      },
      {
        label: 'Admission candidates',
        value: state.candidates.filter((c) => c.status === 'Admitted').length,
        note: 'For academic approval',
        target: 'Admissions',
      },
      {
        label: 'Enrolled',
        value: state.candidates.filter((c) => c.status === 'Enrolled').length,
        note: 'In current cohorts',
        target: 'Enrolment',
      },
    ],
    finance: [
      {
        label: 'Fees charged',
        value: 'MWK 125,000',
        note: 'Sample student account',
        target: 'Fee Accounts',
      },
      {
        label: 'Confirmed collections',
        value: money(
          state.payments.filter((p) => p.status === 'Confirmed').reduce((n, p) => n + p.amount, 0),
        ),
        note: 'Posted payments',
        target: 'Payments',
      },
      {
        label: 'Outstanding balance',
        value: money(studentBalance),
        note: 'Current sample account',
        target: 'Balances',
      },
      {
        label: 'Issued receipts',
        value: state.payments.filter((p) => p.status === 'Confirmed').length,
        note: 'Confirmed transactions',
        target: 'Receipts',
      },
    ],
    administration: [
      {
        label: 'Open requisitions',
        value: state.requisitions.filter(
          (r) => !['Payment initiated', 'Returned'].includes(r.status),
        ).length,
        note: 'Across departments',
        target: 'Requisitions',
      },
      {
        label: 'Staff records',
        value: '38',
        note: 'Illustrative directory',
        target: 'Staff Management',
      },
      { label: 'Records to review', value: '04', note: 'Administrative review', target: 'Records' },
    ],
    'head-of-programs': [
      { label: 'Active programmes', value: '08', note: 'Academic catalogue', target: 'Programmes' },
      { label: 'Course offerings', value: '32', note: 'Semester 2', target: 'Courses' },
      {
        label: 'Exams to approve',
        value: state.assessments.filter(
          (a) => a.type === 'Exam' && a.status === 'Awaiting approval',
        ).length,
        note: 'Lecturer submissions',
        target: 'Exam Approval',
      },
      {
        label: 'Results to review',
        value: state.submissions.filter((s) => s.status === 'Marked').length,
        note: 'Awaiting release review',
        target: 'Results Approval',
      },
    ],
    'head-of-hosom': [
      { label: 'Active students', value: '426', note: 'Institutional sample', target: 'Reports' },
      { label: 'Programmes', value: '08', note: 'Current portfolio', target: 'Reports' },
      {
        label: 'Requisitions',
        value: state.requisitions.filter((r) => r.status === 'Submitted').length,
        note: 'Awaiting review',
        target: 'Requisitions',
      },
      { label: 'Reports', value: '04', note: 'Academic & finance views', target: 'Reports' },
    ],
    director: [
      {
        label: 'Total student records',
        value: '426',
        note: 'Institutional sample',
        target: 'Admissions & Students',
      },
      {
        label: 'Graduated students',
        value: '74',
        note: 'Latest academic period',
        target: 'Academic Performance',
      },
      {
        label: 'Fees collected',
        value: 'MWK 1.8m',
        note: 'Illustrative figure',
        target: 'Finance Summary',
      },
      {
        label: 'Approvals',
        value: state.requisitions.filter((r) => r.status === 'Forwarded').length,
        note: 'Awaiting decision',
        target: 'Approvals',
      },
    ],
    media: [
      {
        label: 'Media resources',
        value: state.resources.length + 11,
        note: 'Course library',
        target: 'Media Library',
      },
      {
        label: 'Published',
        value: state.resources.filter((r) => r.status === 'Published').length + 6,
        note: 'Available for teaching',
        target: 'Media Library',
      },
      {
        label: 'Drafts',
        value: state.resources.filter((r) => r.status === 'Draft').length + 5,
        note: 'In preparation',
        target: 'Media Library',
      },
    ],
    'system-admin': [
      { label: 'User accounts', value: '512', note: 'Sample directory', target: 'Users' },
      { label: 'Active courses', value: '32', note: 'Academic setup', target: 'Courses' },
      {
        label: 'Access roles',
        value: '10',
        note: 'Role workspaces',
        target: 'Roles & Permissions',
      },
      { label: 'System checks', value: '07', note: 'Awaiting review', target: 'Audit Trail' },
    ],
  };
  const quick: Record<RoleSlug, Quick[]> = {
    student: [
      {
        title: 'Learning space',
        detail: 'Lessons, recordings and readings',
        target: 'Learning Space',
      },
      { title: 'Assessments', detail: 'Coursework and exam activity', target: 'Assessments' },
      { title: 'Results', detail: 'Marks and academic outcomes', target: 'Results' },
      { title: 'Fees', detail: 'Balance, payments and receipts', target: 'Fees' },
    ],
    lecturer: [
      { title: 'Course studio', detail: 'Lessons and resources', target: 'Materials' },
      { title: 'Live classes', detail: 'Sessions and attendance', target: 'Live Classes' },
      { title: 'Submissions', detail: 'Mark student work', target: 'Submissions' },
      { title: 'Announcements', detail: 'Share course updates', target: 'Course Announcements' },
    ],
    secretariat: [
      { title: 'Applications', detail: 'Review incoming candidates', target: 'Applications' },
      { title: 'Admissions', detail: 'Coordinate offers and approval', target: 'Admissions' },
      { title: 'Student registry', detail: 'Verify student details', target: 'Manage Students' },
      { title: 'Reports', detail: 'Review academic records', target: 'Reports' },
    ],
    finance: [
      { title: 'Fee accounts', detail: 'Student charges and balances', target: 'Fee Accounts' },
      { title: 'Payments', detail: 'Confirm and reconcile collections', target: 'Payments' },
      { title: 'Receipts', detail: 'Issued payment records', target: 'Receipts' },
      { title: 'Reports', detail: 'Collection summaries', target: 'Reports' },
    ],
    administration: [
      { title: 'Approvals', detail: 'Review staged records', target: 'Approvals' },
      {
        title: 'Staff management',
        detail: 'Personnel and assignments',
        target: 'Staff Management',
      },
      { title: 'Records', detail: 'Institutional register', target: 'Records' },
      { title: 'Operations', detail: 'Events and notices', target: 'Operations' },
    ],
    'head-of-programs': [
      { title: 'Programmes', detail: 'Academic catalogue', target: 'Programmes' },
      { title: 'Course offerings', detail: 'Semester allocations', target: 'Courses' },
      { title: 'Exam approval', detail: 'Review lecturer papers', target: 'Exam Approval' },
      { title: 'Results approval', detail: 'Review submitted marks', target: 'Results Approval' },
    ],
    'head-of-hosom': [
      {
        title: 'Institutional overview',
        detail: 'Student and programme performance',
        target: 'Reports',
      },
      { title: 'Academic report', detail: 'Assessment outcomes', target: 'Reports' },
      { title: 'Admissions report', detail: 'Applications and offers', target: 'Reports' },
      { title: 'Finance summary', detail: 'Collections and balances', target: 'Reports' },
    ],
    director: [
      {
        title: 'Academic performance',
        detail: 'Outcomes by programme',
        target: 'Academic Performance',
      },
      {
        title: 'Finance summary',
        detail: 'Collections and outstanding fees',
        target: 'Finance Summary',
      },
      {
        title: 'Admissions & students',
        detail: 'Student movement',
        target: 'Admissions & Students',
      },
      { title: 'Management reviews', detail: 'Executive direction', target: 'Management Reviews' },
    ],
    media: [
      { title: 'Media library', detail: 'Review available resources', target: 'Media Library' },
      { title: 'Course materials', detail: 'Match media to courses', target: 'Course Materials' },
      { title: 'Announcements', detail: 'Institutional updates', target: 'Announcements' },
    ],
    'system-admin': [
      { title: 'Users', detail: 'Accounts and identity', target: 'Users' },
      {
        title: 'Roles & permissions',
        detail: 'Review access matrix',
        target: 'Roles & Permissions',
      },
      {
        title: 'Academic setup',
        detail: 'Programme and course definitions',
        target: 'Academic Setup',
      },
      { title: 'Audit trail', detail: 'Recent system actions', target: 'Audit Trail' },
    ],
  };
  return (
    <div className="ro-page">
      <div className="ro-title">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {roles[role].person.split(' ')[0]}.</p>
        </div>
        <Link href={portalHref(role, role === 'student' ? 'My Profile' : quick[role][0].target)}>
          {role === 'student' ? 'My profile' : 'Open workspace'} →
        </Link>
      </div>
      <section className="ro-hero">
        <div>
          <p className="eyebrow">{copy.kicker}</p>
          <h2>{copy.title}</h2>
          <p>{copy.copy}</p>
        </div>
        <span className="ro-hero-mark" aria-hidden="true">
          ✦
        </span>
      </section>
      {role === 'student' && (
        <div className="ro-identity">
          <span>{roles[role].id}</span>
          <span>{roles[role].subtitle}</span>
          <span>2026 · Semester 2</span>
        </div>
      )}
      <Metrics role={role} items={metrics[role]} />
      <div className="ro-content-grid">
        <Panel
          title={
            role === 'student'
              ? 'My courses'
              : role === 'lecturer'
                ? 'Teaching courses'
                : role === 'secretariat'
                  ? 'Applications received'
                  : role === 'finance'
                    ? 'Recent payments'
                    : 'Priority activity'
          }
          subtitle={
            role === 'student' ? 'Continue your learning journey' : 'Latest available records'
          }
          href={portalHref(
            role,
            role === 'student' || role === 'lecturer'
              ? 'My Courses'
              : role === 'secretariat'
                ? 'Applications'
                : role === 'finance'
                  ? 'Payments'
                  : quick[role][0].target,
          )}
        >
          {role === 'student' || role === 'lecturer' ? (
            courses.map((c) => (
              <LinkRow
                key={c.code}
                title={c.name}
                detail={`${c.code} · ${role === 'student' ? c.lecturer : `${c.students} students`}`}
                href={portalHref(role, role === 'student' ? 'Learning Space' : 'My Courses')}
                side={`${c.progress}%`}
              />
            ))
          ) : role === 'secretariat' ? (
            state.candidates
              .slice(0, 4)
              .map((c) => (
                <LinkRow
                  key={c.id}
                  title={c.name}
                  detail={`${c.programme} · ${c.status}`}
                  href={portalHref(role, 'Applications')}
                  side="→"
                />
              ))
          ) : role === 'finance' ? (
            state.payments.length ? (
              state.payments
                .slice(0, 4)
                .map((p) => (
                  <LinkRow
                    key={p.id}
                    title={p.student}
                    detail={`${p.id} · ${p.status}`}
                    href={portalHref(role, 'Payments')}
                    side={money(p.amount)}
                  />
                ))
            ) : (
              <p className="ro-empty">
                No payment records yet. Try a sample payment from the Student portal.
              </p>
            )
          ) : (
            quick[role].map((item) => (
              <LinkRow
                key={item.title}
                title={item.title}
                detail={item.detail}
                href={portalHref(role, item.target)}
              />
            ))
          )}
        </Panel>
        <Panel
          title={
            role === 'student'
              ? 'Upcoming work'
              : role === 'lecturer'
                ? 'Assessment queue'
                : role === 'secretariat'
                  ? 'Admission queue'
                  : role === 'finance'
                    ? 'Outstanding accounts'
                    : 'What needs attention'
          }
          subtitle="Keep the next steps in view"
        >
          {role === 'student' ? (
            publishedAssessments
              .slice(0, 3)
              .map((a) => (
                <LinkRow
                  key={a.id}
                  title={a.title}
                  detail={`${a.course} · ${a.type}`}
                  href={portalHref(role, 'Assessments')}
                />
              ))
          ) : role === 'lecturer' ? (
            state.assessments
              .slice(0, 3)
              .map((a) => (
                <LinkRow
                  key={a.id}
                  title={a.title}
                  detail={`${a.course} · ${a.status}`}
                  href={portalHref(role, 'Quizzes & Exams')}
                />
              ))
          ) : role === 'secretariat' ? (
            state.candidates
              .slice(0, 3)
              .map((c) => (
                <LinkRow
                  key={c.id}
                  title={c.name}
                  detail={`${c.id} · ${c.status}`}
                  href={portalHref(role, c.status === 'Published' ? 'Enrolment' : 'Admissions')}
                />
              ))
          ) : role === 'finance' ? (
            <LinkRow
              title="Thoko Banda"
              detail="2026 · Semester 2 fee balance"
              href={portalHref(role, 'Balances')}
              side={money(studentBalance)}
            />
          ) : (
            metrics[role]
              .slice(0, 3)
              .map((m) => (
                <LinkRow
                  key={m.label}
                  title={m.label}
                  detail={m.note}
                  href={portalHref(role, m.target)}
                  side={String(m.value)}
                />
              ))
          )}
        </Panel>
      </div>
      <section className="ro-tools">
        <div className="ro-section-head">
          <p className="eyebrow">{role === 'student' ? 'STUDENT SERVICES' : 'WORKSPACE TOOLS'}</p>
          <h2>
            {role === 'student' ? 'Everything you need, in one place.' : 'Continue your work.'}
          </h2>
        </div>
        <QuickLinks role={role} items={quick[role]} />
      </section>
      <Panel
        title="Latest announcements"
        subtitle="Institutional and course updates"
        href={portalHref(role, 'Announcements')}
      >
        {state.notices.slice(0, 3).map((n) => (
          <LinkRow
            key={n.id}
            title={n.title}
            detail={`${n.author} · ${n.audience}`}
            href={portalHref(role, 'Announcements')}
          />
        ))}
      </Panel>
      <p className="ro-demo-note">
        Illustrative content for the interface preview. Workflow changes last only until refresh.
      </p>
    </div>
  );
}
