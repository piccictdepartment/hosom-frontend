'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { classSessions, courses, portalHref, roles } from '@/lib/demo-data';
import { useWorkflows } from './workflow-provider';
import { StudentModal } from './student-modal';

const href = (section: string) => portalHref('student', section);
const money = (value: number) => `MWK ${value.toLocaleString('en-GB')}`;
const shortDate = (value?: string) => value ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'To be confirmed';

export function StudentOverview() {
  const { state } = useWorkflows();
  const [activeNoticeId, setActiveNoticeId] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setToday(new Date().toLocaleDateString('en-CA')), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const student = roles.student;
  const published = state.assessments.filter(assessment => assessment.status === 'Published');
  const pending = published.filter(assessment => !state.submissions.some(submission => submission.assessmentId === assessment.id && submission.student === student.person));
  const paid = state.payments.filter(payment => payment.status === 'Confirmed').reduce((sum, payment) => sum + payment.amount, 0);
  const balance = Math.max(0, 125000 - paid);
  const notices = state.notices.filter(notice => ['All', 'Students'].includes(notice.audience));
  const activeNotice = notices.find(notice => notice.id === activeNoticeId);
  const sessions = classSessions.filter(session => !today || new Date(session.date).toISOString().slice(0, 10) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const stats = [
    { label: 'Enrolled courses', value: courses.length, target: 'My Courses' },
    { label: 'Awaiting submission', value: pending.length, target: 'Assessments' },
    { label: 'Fee balance', value: money(balance), target: 'Fees' },
  ];

  return <div className="sp-page">
    <div className="sp-title"><div><h1>Dashboard</h1><p>Welcome back, {student.person.split(' ')[0]}.</p></div><Link className="sp-outline" href={href('My Profile')}>My profile →</Link></div>
    <div className="sp-identity"><span>{student.id}</span><span>{student.subtitle}</span><span>2026 · Semester 2</span></div>
    <div className="sp-stats">{stats.map(stat => <Link key={stat.label} href={href(stat.target)}><span>{stat.label}</span><strong>{stat.value}</strong><em>View →</em></Link>)}</div>
    <div className="sp-grid">
      <section className="sp-card"><div className="sp-card-head"><h2>My courses</h2><Link href={href('My Courses')}>View all →</Link></div>{courses.slice(0, 3).map(course => <Link className="sp-row" key={course.code} href={href('Learning Space')}><span className="sp-code">{course.code}</span><span><strong>{course.name}</strong><small>{course.lecturer}</small></span><span aria-hidden="true">→</span></Link>)}{!courses.length && <p className="sp-empty">Your courses will appear after enrolment.</p>}</section>
      <section className="sp-card"><div className="sp-card-head"><h2>Upcoming work</h2><Link href={href('Assessments')}>Assessments →</Link></div>{pending.slice(0, 3).map(assessment => <Link className="sp-row" key={assessment.id} href={href('Assessments')}><span><strong>{assessment.title}</strong><small>{assessment.course} · {assessment.type}</small></span><span className="sp-due">{shortDate(assessment.closesAt)}</span></Link>)}{!pending.length && <p className="sp-empty">You have no outstanding assessments.</p>}</section>
      <section className="sp-card"><div className="sp-card-head"><h2>Next classes</h2><Link href={href('Timetable')}>Timetable →</Link></div>{sessions.slice(0, 2).map(session => <Link className="sp-row" key={session.id} href={href('Learning Space')}><span><strong>{session.title}</strong><small>{session.date} · {session.venue}</small></span><span aria-hidden="true">→</span></Link>)}{!sessions.length && <p className="sp-empty">No upcoming classes scheduled.</p>}<div className="sp-links"><Link href={href('Results')}>Results</Link><Link href={href('Library')}>Library</Link><Link href={href('Fees')}>Payments &amp; receipts</Link></div></section>
      <section className="sp-card"><div className="sp-card-head"><h2>Announcements</h2><span>{notices.length} updates</span></div>{notices.slice(0, 2).map(notice => <button type="button" className="sp-announcement" key={notice.id} onClick={() => setActiveNoticeId(notice.id)}><strong>{notice.title}</strong><small>{notice.author} · {notice.audience === 'All' ? 'All users' : notice.audience}</small></button>)}{!notices.length && <p className="sp-empty">No new announcements.</p>}</section>
    </div>
    {activeNotice && <StudentModal label={activeNotice.title} onClose={() => setActiveNoticeId(null)} className="sp-announcement-dialog"><button type="button" className="student-feature-close" aria-label="Close announcement" onClick={() => setActiveNoticeId(null)}>×</button><p className="eyebrow">ANNOUNCEMENT · {activeNotice.id}</p><h2>{activeNotice.title}</h2><p className="sp-announcement-author">{activeNotice.author} · {activeNotice.audience === 'All' ? 'All users' : activeNotice.audience}</p><p className="sp-announcement-body">{activeNotice.body}</p></StudentModal>}
  </div>;
}
