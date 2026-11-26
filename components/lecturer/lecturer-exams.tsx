'use client';
import { useState, type FormEvent } from 'react';
import { teachingCourses, roster, LecturerDialog, LecturerTable } from './lecturer-pages';

type Exam = {
  id: string;
  title: string;
  course: string;
  instructions: string;
  question: string;
  marks: number;
  status: 'Draft' | 'Pending approval' | 'Approved' | 'Scheduled';
  opens?: string;
  closes?: string;
};
const initial: Exam[] = [
  {
    id: 'EX-1',
    title: 'Foundations of Theology written examination',
    course: 'TH201',
    instructions: 'Answer every question in your own words.',
    question: 'Explain how theological principles apply to ministry practice.',
    marks: 100,
    status: 'Approved',
  },
];
export function LecturerExamManagement() {
  const [rows, setRows] = useState(initial);
  const [active, setActive] = useState<Exam | null>(null);
  const [editing, setEditing] = useState(false);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item: Exam = {
      id: active?.id || `EX-${Date.now()}`,
      title: String(data.get('title')),
      course: String(data.get('course')),
      instructions: String(data.get('instructions')),
      question: String(data.get('question')),
      marks: Number(data.get('marks')),
      status: 'Draft',
    };
    setRows([item, ...rows.filter((row) => row.id !== item.id)]);
    setActive(null);
    setEditing(false);
  }
  return (
    <section className="lp-panel">
      <div className="lp-panel-heading">
        <div>
          <h2>Examination management</h2>
          <p>Structured written exams → Academic approval → Schedule for students</p>
          <small>Lecturer account: Dr. Daniel Phiri · HOSOM/LEC/001</small>
        </div>
        <button
          className="lp-primary"
          onClick={() => {
            setActive(null);
            setEditing(true);
          }}
        >
          + Create exam
        </button>
      </div>
      <LecturerTable headings={['Exam / course', 'Status', 'Schedule', 'Action']}>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <strong>{row.title}</strong>
              <small>
                {row.course} · {row.marks} marks
              </small>
            </td>
            <td>
              <span className="lp-pill">
                {row.status === 'Approved' ? 'Approved — ready to schedule' : row.status}
              </span>
            </td>
            <td>
              {row.opens ||
                (row.status === 'Approved' ? 'Awaiting lecturer scheduling' : 'Not scheduled')}
            </td>
            <td>
              <button className="lp-link" onClick={() => setActive(row)}>
                {row.status === 'Approved' ? 'Schedule exam' : 'Review details'} →
              </button>
            </td>
          </tr>
        ))}
      </LecturerTable>
      {editing && (
        <LecturerDialog
          label="Create or edit exam"
          onClose={() => {
            setEditing(false);
            setActive(null);
          }}
          wide
        >
          <h2>{active ? 'Edit exam' : 'Create exam'}</h2>
          <form className="lp-form" onSubmit={save}>
            <div className="lp-form-grid">
              <label>
                Exam title
                <input name="title" required defaultValue={active?.title} />
              </label>
              <label>
                Course
                <select name="course" defaultValue={active?.course || 'TH201'}>
                  {teachingCourses.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Exam description
              <textarea rows={3} placeholder="Explain the exam’s purpose, topics and scope." />
            </label>
            <label>
              Instructions
              <textarea name="instructions" rows={3} required defaultValue={active?.instructions} />
            </label>
            <fieldset className="lp-question">
              <legend>Question 1</legend>
              <label>
                Question
                <textarea name="question" rows={3} required defaultValue={active?.question} />
              </label>
              <div className="lp-form-grid">
                <p>Structured · Written response</p>
                <label>
                  Marks
                  <input
                    name="marks"
                    type="number"
                    min="1"
                    required
                    defaultValue={active?.marks || 10}
                  />
                </label>
              </div>
            </fieldset>
            <div className="lp-actions">
              <button className="lp-primary" type="submit">
                Save draft
              </button>
              <button
                className="lp-outline"
                type="button"
                onClick={() => {
                  setEditing(false);
                  setActive(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
      {active && !editing && (
        <LecturerDialog label="Exam review" onClose={() => setActive(null)} wide>
          <h2>{active.title}</h2>
          <p>
            {active.course} · {active.marks} marks · {active.status}
          </p>
          <p>{active.instructions}</p>
          <article className="lp-question">
            <strong>1. {active.question}</strong>
            <small>{active.marks} marks · Written answer</small>
          </article>
          {active.status === 'Approved' && (
            <form
              className="lp-form"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setRows(
                  rows.map((row) =>
                    row.id === active.id
                      ? {
                          ...row,
                          opens: String(data.get('opens')),
                          closes: String(data.get('closes')),
                          status: 'Scheduled',
                        }
                      : row,
                  ),
                );
                setActive(null);
              }}
            >
              <h3>Schedule approved exam</h3>
              <div className="lp-form-grid">
                <label>
                  Opens at
                  <input name="opens" type="datetime-local" required />
                </label>
                <label>
                  Closes at
                  <input name="closes" type="datetime-local" required />
                </label>
                <label>
                  Duration (minutes)
                  <input type="number" min="1" defaultValue={60} required />
                </label>
              </div>
              <button className="lp-primary" type="submit">
                Schedule exam
              </button>
            </form>
          )}
          {active.status === 'Draft' && (
            <div className="lp-actions">
              <button className="lp-outline" onClick={() => setEditing(true)}>
                Edit draft
              </button>
              <button
                className="lp-primary"
                onClick={() => {
                  setRows(
                    rows.map((row) =>
                      row.id === active.id ? { ...row, status: 'Pending approval' } : row,
                    ),
                  );
                  setActive(null);
                }}
              >
                Send for approval
              </button>
            </div>
          )}
        </LecturerDialog>
      )}
    </section>
  );
}
export function LecturerExamSubmissions() {
  const [active, setActive] = useState<(typeof roster)[number] | null>(null);
  return (
    <section className="lp-panel">
      <div className="lp-panel-heading">
        <div>
          <span className="lp-kicker">EXAM SUBMISSIONS</span>
          <h2>Submitted exams</h2>
          <p>Review each exam, record marks and add feedback.</p>
        </div>
      </div>
      <LecturerTable headings={['Student', 'Exam / course', 'Submitted', 'Status', 'Action']}>
        {roster.map((row, index) => (
          <tr key={row.id}>
            <td>
              <strong>{row.name}</strong>
              <small>{row.id}</small>
            </td>
            <td>
              End-of-unit examination<small>{teachingCourses[index].code}</small>
            </td>
            <td>14 Nov 2026</td>
            <td>
              <span className="lp-pill">Awaiting marking</span>
            </td>
            <td>
              <button className="lp-link" onClick={() => setActive(row)}>
                Mark exam →
              </button>
            </td>
          </tr>
        ))}
      </LecturerTable>
      {active && (
        <LecturerDialog label="Review exam submission" onClose={() => setActive(null)} wide>
          <h2>{active.name}</h2>
          <p>End-of-unit examination</p>
          <div className="lp-mark-review">
            <section>
              <h3>Submitted work</h3>
              <p>Course principles guide how a leader plans, communicates and serves.</p>
            </section>
            <section>
              <h3>Mark &amp; feedback</h3>
              <form
                className="lp-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setActive(null);
                }}
              >
                <label>
                  Mark (out of 100)
                  <input type="number" min="0" max="100" required />
                </label>
                <label>
                  Feedback
                  <textarea rows={5} required />
                </label>
                <button className="lp-primary" type="submit">
                  Save grading draft
                </button>
              </form>
            </section>
          </div>
        </LecturerDialog>
      )}
    </section>
  );
}
