'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { classSessions, lecturerTeachingCourses, portalHref } from '@/lib/demo-data';
import { useWorkflows } from './workflow-provider';

const href = (section: string) => portalHref('lecturer', section);
const assignedCourses = lecturerTeachingCourses;

function Empty({ title, copy }: { title: string; copy: string }) {
  return <div className="lecturer-empty"><strong>{title}</strong><p>{copy}</p></div>;
}

function Panel({ title, subtitle, target, children }: { title: string; subtitle: string; target: string; children: React.ReactNode }) {
  return <section className="lecturer-panel"><div className="lecturer-panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><Link href={href(target)}>View all →</Link></div>{children}</section>;
}

export function LecturerOverview() {
  const { state } = useWorkflows();
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setToday(new Date().toLocaleDateString('en-CA')), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const assignedCodes = assignedCourses.map(course => course.code);
  const awaiting = state.submissions.filter(item => item.status === 'Submitted' && assignedCodes.includes(state.assessments.find(record => record.id === item.assessmentId)?.course || ''));
  const readyCourses = assignedCourses.filter(course => state.submissions.some(item => {
    const assessment = state.assessments.find(record => record.id === item.assessmentId);
    return assessment?.course === course.code && item.status === 'Marked';
  }));
  const sessions = classSessions.filter(item => !today || new Date(item.date).toISOString().slice(0, 10) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const notices = state.notices.filter(item => ['All', 'Staff', 'Lecturers'].includes(item.audience));
  const stats = [
    { label: 'Assigned courses', value: assignedCourses.length, target: 'My Courses', icon: '▤' },
    { label: 'Awaiting marking', value: awaiting.length, target: 'Marks', icon: '◎' },
    { label: 'Upcoming classes', value: sessions.length, target: 'Live Classes', icon: '▦' },
    { label: 'Results to submit', value: readyCourses.length, target: 'Marks', icon: '◫' },
  ];
  const tools = [
    { label: 'Materials', copy: 'Organise course notes and learning resources.', icon: '▤' },
    { label: 'Assignments', copy: 'Prepare and review course assignments.', icon: '▣' },
    { label: 'Quizzes & Exams', copy: 'Manage online quizzes and examinations.', icon: '◎' },
    { label: 'Attendance', copy: 'Review student class participation.', icon: '◉' },
  ];

  return <div className="lecturer-dashboard">
    <section className="lecturer-welcome"><div><span className="lecturer-kicker">YOUR TEACHING WORKSPACE</span><h1>Inspire learning. Shape the next generation.</h1><p>Keep your courses, classes and assessment responsibilities in focus.</p></div><Link className="lecturer-welcome-link" href={href('My Courses')}>View my courses →</Link></section>
    <section className="lecturer-stat-grid" aria-label="Teaching summary">{stats.map(item => <Link className="lecturer-stat-card" href={href(item.target)} key={item.label}><span className="lecturer-stat-icon" aria-hidden="true">{item.icon}</span><span className="lecturer-stat-label">{item.label}</span><strong>{item.value}</strong><small>View details →</small></Link>)}</section>
    <div className="lecturer-dashboard-grid">
      <Panel title="My teaching courses" subtitle="Your assigned academic responsibilities" target="My Courses">{assignedCourses.length ? <div className="lecturer-course-list">{assignedCourses.slice(0, 4).map(course => <Link className="lecturer-course-item" href={href('My Courses')} key={course.code}><span className="lecturer-course-code">{course.code}</span><span><strong>{course.name}</strong><small>{course.students} enrolled students · {course.cohort}</small></span><span aria-hidden="true">→</span></Link>)}</div> : <Empty title="No courses assigned yet" copy="Your assigned courses and student counts will appear here." />}</Panel>
      <Panel title="Upcoming classes" subtitle="Plan your next teaching sessions" target="Live Classes">{sessions.length ? <div className="lecturer-session-list">{sessions.slice(0, 3).map(item => <Link href={href('Live Classes')} key={item.id}><span className="lecturer-session-time">{item.date} · {item.time}</span><strong>{item.title}</strong><small>{item.venue}</small></Link>)}</div> : <Empty title="No upcoming classes" copy="Scheduled teaching sessions will appear here." />}</Panel>
      <Panel title="Marking priorities" subtitle="Submissions requiring your attention" target="Marks">{awaiting.length ? <div className="lecturer-marking-list">{awaiting.slice(0, 4).map(item => { const assessment = state.assessments.find(record => record.id === item.assessmentId); return <Link href={href('Marks')} key={item.id}><span><strong>{assessment?.title || 'Assessment submission'}</strong><small>{assessment?.course || ''} · {item.student}</small></span><em>Awaiting marking</em></Link>; })}</div> : <Empty title="No submissions awaiting marking" copy="Submitted assessments will appear here when they are ready to review." />}</Panel>
      <Panel title="Announcements" subtitle="Updates for your teaching community" target="Announcements">{notices.length ? <div className="lecturer-announcement-list">{notices.slice(0, 3).map(item => <Link href={href('Announcements')} key={item.id}><strong>{item.title}</strong><p>{item.body}</p><small>{item.author}</small></Link>)}</div> : <Empty title="No announcements to display" copy="Course and institutional updates will appear here." />}</Panel>
    </div>
    <section className="lecturer-teaching-tools"><h2>Teaching tools</h2><div>{tools.map(item => <Link href={href(item.label)} key={item.label}><span className="lecturer-tool-icon" aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><small>{item.copy}</small><span className="lecturer-tool-arrow" aria-hidden="true">→</span></Link>)}</div></section>
  </div>;
}
