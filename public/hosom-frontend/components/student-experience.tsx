'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { courses } from '@/lib/demo-data';
import { useWorkflows } from '@/components/workflow-provider';
import { StudentModal } from '@/components/student-modal';

const sampleQuizChoices = [
  ['Faith and ministry practice', 'Financial management only', 'Church architecture'],
  ['It guides character and service', 'It replaces the need to serve', 'It applies only during exams'],
  ['Serving a local community with humility', 'Avoiding all group work', 'Ignoring course readings'],
];
export function StudentAssessments() {
  const { state, dispatch } = useWorkflows();
  const [tab, setTab] = useState<'Assignments' | 'Exams' | 'Quizzes'>('Assignments');
  const [activeId, setActiveId] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [review, setReview] = useState(false);
  const [ack, setAck] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [selectedFile, setSelectedFile] = useState('');
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const published = state.assessments.filter(a => a.status === 'Published');
  const visible = published.filter(a => a.type === (tab === 'Assignments' ? 'Assignment' : tab === 'Exams' ? 'Exam' : 'Quiz'));
  const submitted = state.submissions.filter(s => s.student === 'Thoko Banda' && published.some(a => a.id === s.assessmentId));
  const active = published.find(a => a.id === activeId);
  const activeSubmission = submitted.find(s => s.assessmentId === activeId);
  const questions = active ? active.type === 'Quiz' && active.id === 'AS-102'
    ? [active.question, 'How does belief shape ministry practice?', 'Give one example from this course.']
    : [active.question] : [];
  const examEnd = active?.type === 'Exam' && startedAt ? Math.min(startedAt + 60 * 60 * 1000, active.closesAt ? new Date(active.closesAt).getTime() : Infinity) : null;
  const remaining = examEnd === null ? null : Math.max(0, examEnd - now);
  useEffect(() => {
    if (active?.type !== 'Exam' || examEnd === null) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current < examEnd) return;
      dispatch({ type: 'submission/add', assessmentId: active.id, answer: answers.map((a,i) => 'Question ' + (i+1) + ': ' + (a.trim() || '[unanswered]')).join('\n\n') });
      setNotice('Exam time ended. Your current answers were submitted.');
      setActiveId('');
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, examEnd, answers, dispatch]);
  function start(id: string, count: number) { setActiveId(id); setAnswers(Array(count).fill('')); setStartedAt(new Date().getTime()); setNow(new Date().getTime()); setSelectedFile(''); setReview(false); setAck(false); }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!active || !ack || (active.type === 'Assignment' ? !selectedFile : answers.some(a => !a.trim()))) return;
    dispatch({ type: 'submission/add', assessmentId: active.id, answer: active.type === 'Assignment' ? 'Selected file: ' + selectedFile + ' (demo only; file not uploaded)' : answers.map((a,i) => 'Question ' + (i+1) + ': ' + a.trim()).join('\n\n') });
    setNotice(active.type + ' submitted for marking.'); setActiveId('');
  }
  return <div className="workflow-page student-feature-page student-assessments">
    <h1 className="student-assessments-page-title">Assessments</h1>
    <section className="student-assessments-intro"><span>YOUR ACADEMIC WORK</span><h2>Prepare. Complete. Achieve.</h2><p>Manage your assignments, take online exams and complete quizzes in one place.</p></section>
    <section className="student-assessments-stats" aria-label="Assessment summary"><div><span>Total assessments</span><strong>{published.length}</strong></div><div><span>Awaiting submission</span><strong>{published.length - submitted.length}</strong></div><div><span>Submitted</span><strong>{submitted.length}</strong></div></section>
    {notice && <p className="flow-success" role="status">{notice}</p>}
    <div className="student-assessments-toolbar"><div className="student-assessments-tabs" role="group" aria-label="Assessment type">{(['Assignments','Exams','Quizzes'] as const).map(name => <button key={name} className={tab === name ? 'active' : ''} aria-pressed={tab === name} onClick={() => { setTab(name); setActiveId(''); setNotice(''); }}>{name === 'Exams' ? `Exams (${published.filter(a => a.type === 'Exam').length})` : name}</button>)}</div><span>{tab === 'Quizzes' ? 'Multiple-choice questions only' : `${visible.length} ${tab.toLowerCase()}`}</span></div>
    {visible.length ? <div className="student-assessments-list">{visible.map(a => {
      const mine = submitted.find(s => s.assessmentId === a.id);
      const closed = Boolean(a.closesAt && now > new Date(a.closesAt).getTime());
      const courseName = courses.find(c => c.code === a.course)?.name ?? a.course;
      return <article className="student-assessment-card" key={a.id}><div className="student-assessment-card-top"><span className="student-assessment-type">{tab}</span><span className="student-assessment-state">{mine ? mine.status : closed ? 'Closed' : 'Published'}</span></div><h3>{a.title}</h3><p>{courseName}</p><p>{a.closesAt ? `Due ${new Date(a.closesAt).toLocaleString('en-US')}` : 'Deadline to be confirmed'}</p><button className="student-assessment-action" onClick={() => start(a.id, a.id === 'AS-102' ? 3 : 1)}>{a.type === 'Assignment' ? 'View assignment' : a.type === 'Exam' ? 'View exam' : mine ? 'View submission' : 'Start quiz'} →</button></article>;
    })}</div> : <section className="student-assessments-empty"><div aria-hidden="true">{tab === 'Quizzes' ? '?' : '▤'}</div><h2>No {tab.toLowerCase()} published yet</h2><p>{tab === 'Exams' ? 'Your online exams, exam instructions and scheduled times will appear here when published.' : tab === 'Quizzes' ? 'Your course quizzes and their deadlines will appear here when published.' : 'Your assignments, submission instructions and due dates will appear here when published.'}</p></section>}
    <div className="student-assessments-guidance">{[['Check instructions','Review deadlines, allowed materials and submission requirements.'],['Complete your work','Answer the questions online or upload the required assignment file.'],['Review and submit','Check your answers and keep your submission confirmation.']].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2,'0')}</span><div><strong>{title}</strong><p>{detail}</p></div></div>)}</div>
    {active && <StudentModal label={active.title} onClose={() => setActiveId('')} className="student-assessment-dialog"><div className="student-assessment-dialog-header"><strong>{active.title}</strong><button className="student-feature-close" aria-label="Close form" onClick={() => setActiveId('')}>×</button></div><div className="student-assessment-dialog-content"><button className="student-assessment-back" onClick={() => setActiveId('')}>← Back to {tab.toLowerCase()}</button><span className="student-assessment-detail-badge">{tab}</span><h2>{active.title}</h2><p className="student-assessment-detail-course">{courses.find(c => c.code === active.course)?.name ?? active.course}</p><section className="student-assessment-instructions"><h3>Instructions</h3><p>{active.question}</p><dl><div><dt>Deadline</dt><dd>{active.closesAt ? new Date(active.closesAt).toLocaleString('en-US') : 'To be confirmed'}</dd></div><div><dt>Duration</dt><dd>{active.type === 'Exam' ? '60 minutes' : 'As instructed by your lecturer'}</dd></div></dl></section>{remaining !== null && <p className="student-feature-timer" role="timer">Time remaining: {Math.floor(remaining / 60000)}:{String(Math.floor((remaining % 60000) / 1000)).padStart(2,'0')}</p>}
      {activeSubmission ? <div className="student-assessment-feedback" role="status"><h3>Submission received</h3><p>Reference: {activeSubmission.id}</p><p>Your work has been received and is awaiting lecturer review.</p><button className="student-assessment-action" onClick={() => setActiveId('')}>Done</button></div> : active.type === 'Assignment' ? <form className="student-assessment-submit-form" onSubmit={submit}><label className="student-feature-attachment">Upload your assignment<input type="file" required accept=".pdf,.doc,.docx" onChange={e => setSelectedFile(e.target.files?.[0]?.name || '')} /><small>{selectedFile || 'Accepted formats: PDF, DOC and DOCX.'}</small></label><label className="student-feature-check"><input type="checkbox" required checked={ack} onChange={e => setAck(e.target.checked)} /> I confirm that this is my own work and I have reviewed my answers.</label><button className="student-assessment-action" disabled={!ack || !selectedFile}>Submit assignment</button><small className="student-assessment-demo-note">Demo selection only. The file is not uploaded and this submission resets on refresh.</small></form> : !review ? <form onSubmit={e => { e.preventDefault(); setReview(true); }}><div className="student-feature-questions">{questions.map((q,i) => <fieldset key={i}><legend>{i+1}. {q}</legend>{active.type === 'Quiz' && active.id === 'AS-102' ? <div className="student-quiz-options">{sampleQuizChoices[i].map(option => <label key={option}><input type="radio" name={'question-' + i} value={option} required checked={answers[i] === option} onChange={e => setAnswers(answers.map((x,j) => j === i ? e.target.value : x))} /> {option}</label>)}</div> : <textarea required rows={5} value={answers[i]} onChange={e => setAnswers(answers.map((x,j) => j === i ? e.target.value : x))} placeholder="Write your answer here…" />}</fieldset>)}</div><button className="student-assessment-action">Review answers</button></form> : <form onSubmit={submit}><h3>Review your answers</h3>{answers.map((a,i) => <div className="student-feature-answer" key={i}><strong>Question {i+1}</strong><p>{a}</p></div>)}<label className="student-feature-check"><input type="checkbox" required checked={ack} onChange={e => setAck(e.target.checked)} /> I confirm that this is my own work and I have reviewed my answers.</label><div className="flow-actions"><button type="button" className="flow-outline" onClick={() => setReview(false)}>Continue editing</button><button className="student-assessment-action" disabled={!ack}>Submit {active.type.toLowerCase()}</button></div></form>}</div></StudentModal>}
  </div>;
}
export { StudentFinance } from '@/components/student-finance';

type ResultRow = { id: string; course: string; title: string; type: string; mark?: number; maxMark?: number; grade?: string; status: string; feedback?: string };
const sampleResults: ResultRow[] = [
  { id: 'RES-TH201-A', course: 'TH201', title: 'Theology reflection', type: 'Assignment', mark: 78, maxMark: 100, grade: 'B+', status: 'Published', feedback: 'A thoughtful reflection with clear links to the course material.' },
  { id: 'RES-MN202-Q', course: 'MN202', title: 'Leadership quiz', type: 'Quiz', mark: 17, maxMark: 20, grade: 'A', status: 'Published' },
  { id: 'RES-TH201-E', course: 'TH201', title: 'Mid-semester examination', type: 'Exam', mark: 74, maxMark: 100, grade: 'B+', status: 'Approved' },
  { id: 'RES-BI101-A', course: 'BI101', title: 'Interpretation assignment', type: 'Assignment', status: 'Awaiting release' },
];
export function StudentResults() {
  const { state } = useWorkflows();
  const [kind, setKind] = useState('All results');
  const [query, setQuery] = useState('');
  const submissions: ResultRow[] = state.submissions.filter(s => s.student === 'Thoko Banda' && s.status !== 'Submitted').map(s => {
    const a = state.assessments.find(x => x.id === s.assessmentId);
    return { id: s.id, course: a?.course || '—', title: a?.title || 'Assessment', type: a?.type || 'Assignment', mark: s.status === 'Published' ? s.mark : undefined, maxMark: 100, grade: s.status === 'Published' && s.mark !== undefined ? s.mark >= 80 ? 'A' : s.mark >= 70 ? 'B+' : s.mark >= 60 ? 'B' : 'C' : undefined, status: s.status === 'Published' ? 'Published' : 'Awaiting release', feedback: s.status === 'Published' ? s.feedback : undefined };
  });
  const rows = [...sampleResults, ...submissions];
  const typeForTab: Record<string, string> = { Exams: 'Exam', Assignments: 'Assignment', Quizzes: 'Quiz' };
  const visible = rows.filter(r => (kind === 'All results' || r.type === typeForTab[kind]) && (r.course + ' ' + (courses.find(c => c.code === r.course)?.name || '') + ' ' + r.title).toLowerCase().includes(query.toLowerCase()));
  const released = rows.filter(r => ['Published','Approved'].includes(r.status) && r.mark !== undefined);
  const percent = (row: ResultRow) => row.mark !== undefined ? row.mark / (row.maxMark || 100) * 100 : null;
  const average = released.length ? (released.reduce((n,r) => n + (percent(r) || 0),0) / released.length).toFixed(1) + '%' : '—';
  function download() {
    const cells = [['HOSOM — Student results'],['Student','Thoko Banda'],['Student ID','HOSOM/2026/014'],['Average of published results',average],[],['Course code','Course','Assessment','Type','Mark','Percentage','Grade','Status'],...visible.map(r => [r.course,courses.find(c => c.code === r.course)?.name || r.course,r.title,r.type,percent(r) === null ? 'Not released' : `${r.mark} / ${r.maxMark || 100}`,percent(r) === null ? '' : `${percent(r)?.toFixed(1)}%`,percent(r) === null ? '—' : r.grade || '—',r.status])];
    const csv = cells.map(row => row.map(cell => '"' + String(cell).replaceAll('"','""') + '"').join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'HOSOM-student-results.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="workflow-page student-feature-page student-results-page">
    <h1>Results</h1>
    <section className="student-results-hero"><div><span>YOUR ACADEMIC PERFORMANCE</span><h2>Your progress, clearly presented.</h2><p>View published exam results, assignment marks and quiz grades.</p></div><div className="student-results-exports"><button onClick={download} disabled={!visible.length}>Export CSV</button><button onClick={() => window.print()}>Print / Save PDF</button></div></section>
    <section className="student-results-summary" aria-label="Results summary"><div className="student-results-average"><span>Overall performance</span><strong>{average}</strong><p>Average of published results</p><small>An unweighted average. Official programme results follow HOSOM grading rules.</small></div><div><span>Published results</span><strong>{released.length}</strong><small>Available for review</small></div><div><span>Awaiting release</span><strong>{rows.filter(r => !['Published','Approved'].includes(r.status)).length}</strong><small>Grades remain hidden until published</small></div></section>
    <div className="student-results-toolbar"><div className="student-results-tabs" role="group" aria-label="Result type">{['All results','Exams','Assignments','Quizzes'].map(name => <button key={name} className={kind === name ? 'active' : ''} aria-pressed={kind === name} onClick={() => setKind(name)}>{name}</button>)}</div><input type="search" aria-label="Search results" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search course or assessment" /></div>
    <section className="student-results-table-card"><div className="student-results-table-heading"><h2>Academic results</h2><span>{visible.length} results</span></div><div className="student-results-table"><table><thead><tr><th>Course / assessment</th><th>Type</th><th>Mark</th><th>Performance</th><th>Grade</th><th>Status</th></tr></thead><tbody>{visible.map(r => { const value = percent(r); return <tr key={r.id}><td><strong>{courses.find(c => c.code === r.course)?.name || r.course}</strong><small>{r.course} · {r.title}</small>{r.feedback && <details><summary>Lecturer feedback</summary><p>{r.feedback}</p></details>}</td><td>{r.type}</td><td>{value === null ? '—' : `${r.mark} / ${r.maxMark || 100}`}</td><td>{value === null ? <span className="student-result-pending">Not released</span> : <div className="student-result-performance">{value.toFixed(1)}%<span className="student-result-track"><i style={{ width: `${value}%` }} /></span></div>}</td><td><strong className="student-result-grade">{value === null ? '—' : r.grade || '—'}</strong></td><td><span className={`student-result-status ${r.status === 'Awaiting release' ? 'is-pending' : 'is-published'}`}>{r.status}</span></td></tr>; })}{visible.length === 0 && <tr><td colSpan={6} className="student-results-empty">No results match your search or filter.</td></tr>}</tbody></table></div></section>
    <section className="student-results-information"><strong>Understanding your results</strong><p>Only published marks contribute to the performance summary. Exam, assignment and quiz weightings are applied in your official final course result. Your downloaded file reflects the current filters.</p></section>
  </div>;
}
