/** Ephemeral workflow state for interface demonstrations. Reloading resets everything. */
export type CandidateStatus = 'Submitted' | 'Selected' | 'Admitted' | 'Approved' | 'Published' | 'Enrolled';
export type Candidate = { id: string; name: string; programme: string; status: CandidateStatus; cohort?: string; details?: Record<string, string> };
export type AssessmentStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Published';
export type Assessment = { id: string; title: string; course: string; type: 'Assignment' | 'Quiz' | 'Exam'; question: string; status: AssessmentStatus; closesAt?: string };
export type Submission = { id: string; assessmentId: string; student: string; answer: string; status: 'Submitted' | 'Marked' | 'Reviewed' | 'Published'; mark?: number; feedback?: string };
export type Resource = { id: string; title: string; course: string; type: string; url: string; status: 'Draft' | 'Published'; completed: boolean; description?: string; body?: string; unitId?: string; order?: number; fileName?: string; allowDownload?: boolean; approvedExternal?: boolean };
export type CourseUnit = { id: string; course: string; title: string; description: string; order: number };
export type Payment = { id: string; student: string; amount: number; method: string; status: 'Pending' | 'Confirmed'; reference?: string; receiptNumber?: string; paidAt?: string; account?: string };
export type Requisition = { id: string; title: string; amount: number; requester: string; status: 'Draft' | 'Submitted' | 'Forwarded' | 'Approved' | 'Payment initiated' | 'Returned' };
export type Notice = { id: string; title: string; body: string; audience: string; author: string };
export type EventRecord = { id: string; title: string; date: string; location: string; audience: string; author: string; body?: string; spoc?: string };
export type WorkflowState = { candidates: Candidate[]; assessments: Assessment[]; submissions: Submission[]; resources: Resource[]; courseUnits: CourseUnit[]; completedStaticResources: string[]; studentProfile: Record<string,string>; studentProfileRequests: string[]; studentEnrollmentRequests: string[]; payments: Payment[]; requisitions: Requisition[]; notices: Notice[]; events: EventRecord[] };
export const initialWorkflowState: WorkflowState = {
  candidates: [
    { id: 'APP-2026-104', name: 'Mphatso Moyo', programme: 'Diploma in Theology', status: 'Submitted' },
    { id: 'APP-2026-103', name: 'Lumbani Chirwa', programme: 'Certificate in Ministry', status: 'Selected' },
    { id: 'APP-2026-102', name: 'Chikondi Banda', programme: 'Diploma in Theology', status: 'Admitted' },
  ],
  assessments: [
    { id: 'AS-101', title: 'Leadership reflection paper', course: 'TH201', type: 'Assignment', question: 'Check the deadline before submitting.\n\nWrite a 1,000-word reflection on servant leadership. Include an introduction, biblical examples and practical application.', status: 'Published', closesAt: '2026-11-26T18:00' },
    { id: 'AS-102', title: 'Biblical interpretation practice quiz', course: 'BI101', type: 'Quiz', question: 'What is the main theme of this unit?', status: 'Published', closesAt: '2026-11-29T18:00' },
    { id: 'AS-105', title: 'Ministry team case study', course: 'MN202', type: 'Assignment', question: 'Deadline passed — submissions closed.\n\nReview the supplied leadership case and propose a team development plan.', status: 'Published', closesAt: '2026-11-16T18:00' },
    { id: 'AS-103', title: 'Ministry Leadership final exam', course: 'MN202', type: 'Exam', question: 'Describe two leadership principles and an example of each.', status: 'Awaiting approval' },
    { id: 'AS-104', title: 'Biblical Interpretation practice exam', course: 'BI101', type: 'Exam', question: 'Explain how context guides interpretation of a passage.', status: 'Awaiting approval', closesAt: '2026-12-05T17:00' },
  ],
  submissions: [
    { id: 'DEMO-ASG-2', assessmentId: 'AS-105', student: 'Thoko Banda', answer: 'Assignment file submitted in the source UI demo.', status: 'Submitted' },
  ],
  resources: [
    { id: 'RS-101', title: 'Getting started with Biblical Interpretation', course: 'BI101', type: 'Lesson', url: '', status: 'Published', completed: false },
    { id: 'RS-102', title: 'Theology study guide', course: 'TH201', type: 'Document', url: '', status: 'Published', completed: false },
    { id: 'RS-103', title: 'Ministry leadership recording', course: 'MN202', type: 'Video', url: '', status: 'Draft', completed: false },
  ],
  courseUnits: [],
  completedStaticResources: [],
  studentProfile: {},
  studentProfileRequests: [],
  studentEnrollmentRequests: [],
  payments: [],
  requisitions: [
    { id: 'REQ-101', title: 'Learning resource equipment', amount: 250000, requester: 'Administration', status: 'Submitted' },
  ],
  events: [
    { id: 'EV-101', title: 'Semester academic review meeting', date: '2026-11-26T09:00', location: 'HOSOM conference room', audience: 'Staff', author: 'Academic office' },
    { id: 'EV-102', title: 'Student orientation and support', date: '2026-12-02T14:00', location: 'Online classroom', audience: 'All', author: 'Secretariat' },
  ],
  notices: [
    { id: 'NO-101', title: 'Semester 2 academic calendar published', body: 'Review the current academic calendar and upcoming assessment dates.', audience: 'All', author: 'Academic office' },
  ],
};
export type WorkflowAction =
  | { type: 'candidate/add'; name: string; programme: string; details?: Record<string, string> }
  | { type: 'candidate/status'; id: string; status: CandidateStatus; cohort?: string }
  | { type: 'assessment/add'; title: string; course: string; kind: Assessment['type']; question: string }
  | { type: 'assessment/status'; id: string; status: AssessmentStatus; closesAt?: string }
  | { type: 'submission/add'; assessmentId: string; answer: string }
  | { type: 'submission/mark'; id: string; mark: number; feedback: string }
  | { type: 'submission/status'; id: string; status: Submission['status'] }
  | { type: 'resource/add'; title: string; course: string; kind: string; url: string }
  | { type: 'resource/save'; resource: Resource }
  | { type: 'course-unit/add'; unit: CourseUnit }
  | { type: 'resource/status'; id: string; status: Resource['status'] }
  | { type: 'resource/complete'; id: string }
  | { type: 'resource/complete-static'; id: string }
  | { type: 'student/profile'; values: Record<string,string> }
  | { type: 'student/profile-request'; detail: string }
  | { type: 'student/enrollment-request'; detail: string }
  | { type: 'payment/add'; amount: number; method: string }
  | { type: 'payment/demo-confirmed'; payment: Payment }
  | { type: 'payment/confirm'; id: string }
  | { type: 'requisition/add'; title: string; amount: number; requester: string }
  | { type: 'requisition/status'; id: string; status: Requisition['status'] }
  | { type: 'notice/add'; title: string; body: string; audience: string; author: string }
  | { type: 'event/add'; title: string; date: string; location: string; audience: string; author: string; body?: string; spoc?: string }
  | { type: 'reset' };
const nextId = (prefix: string, count: number) => `${prefix}-DEMO-${String(count + 1).padStart(3, '0')}`;
export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'candidate/add': return { ...state, candidates: [{ id: nextId('APP', state.candidates.length), name: action.name, programme: action.programme, details: action.details, status: 'Submitted' }, ...state.candidates] };
    case 'candidate/status': return { ...state, candidates: state.candidates.map(row => row.id === action.id ? { ...row, status: action.status, cohort: action.cohort ?? row.cohort } : row) };
    case 'assessment/add': return { ...state, assessments: [{ id: nextId('AS', state.assessments.length), title: action.title, course: action.course, type: action.kind, question: action.question, status: 'Draft' }, ...state.assessments] };
    case 'assessment/status': return { ...state, assessments: state.assessments.map(row => row.id === action.id ? { ...row, status: action.status, closesAt: action.closesAt ?? row.closesAt } : row) };
    case 'submission/add': return { ...state, submissions: [{ id: nextId('SUB', state.submissions.length), assessmentId: action.assessmentId, student: 'Thoko Banda', answer: action.answer, status: 'Submitted' }, ...state.submissions] };
    case 'submission/mark': return { ...state, submissions: state.submissions.map(row => row.id === action.id ? { ...row, mark: action.mark, feedback: action.feedback, status: 'Marked' } : row) };
    case 'submission/status': return { ...state, submissions: state.submissions.map(row => row.id === action.id ? { ...row, status: action.status } : row) };
    case 'resource/add': return { ...state, resources: [{ id: nextId('RS', state.resources.length), title: action.title, course: action.course, type: action.kind, url: action.url, status: 'Draft', completed: false }, ...state.resources] };
    case 'resource/save': return { ...state, resources: [action.resource, ...state.resources.filter(row => row.id !== action.resource.id)] };
    case 'course-unit/add': return { ...state, courseUnits: [...state.courseUnits, action.unit] };
    case 'resource/status': return { ...state, resources: state.resources.map(row => row.id === action.id ? { ...row, status: action.status } : row) };
    case 'resource/complete': return { ...state, resources: state.resources.map(row => row.id === action.id ? { ...row, completed: true } : row) };
    case 'resource/complete-static': return { ...state, completedStaticResources: state.completedStaticResources.includes(action.id) ? state.completedStaticResources : [...state.completedStaticResources, action.id] };
    case 'student/profile': return { ...state, studentProfile: { ...action.values } };
    case 'student/profile-request': return { ...state, studentProfileRequests: [action.detail, ...state.studentProfileRequests] };
    case 'student/enrollment-request': return { ...state, studentEnrollmentRequests: [action.detail, ...state.studentEnrollmentRequests] };
    case 'payment/add': return { ...state, payments: [{ id: nextId('PAY', state.payments.length), student: 'Thoko Banda', amount: action.amount, method: action.method, status: 'Pending' }, ...state.payments] };
    case 'payment/demo-confirmed': return { ...state, payments: [action.payment, ...state.payments] };
    case 'payment/confirm': return { ...state, payments: state.payments.map(row => row.id === action.id ? { ...row, status: 'Confirmed' } : row) };
    case 'requisition/add': return { ...state, requisitions: [{ id: nextId('REQ', state.requisitions.length), title: action.title, amount: action.amount, requester: action.requester, status: 'Submitted' }, ...state.requisitions] };
    case 'requisition/status': return { ...state, requisitions: state.requisitions.map(row => row.id === action.id ? { ...row, status: action.status } : row) };
    case 'event/add': return { ...state, events: [{ id: nextId('EV', state.events.length), title: action.title, date: action.date, location: action.location, audience: action.audience, author: action.author, body: action.body, spoc: action.spoc }, ...state.events] };
    case 'notice/add': return { ...state, notices: [{ id: nextId('NO', state.notices.length), title: action.title, body: action.body, audience: action.audience, author: action.author }, ...state.notices] };
    case 'reset': return initialWorkflowState;
  }
}
