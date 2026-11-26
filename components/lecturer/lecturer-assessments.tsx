'use client';

import { useState, type FormEvent } from 'react';
import {
  teachingCourses,
  roster,
  LecturerDialog,
  LecturerHero,
  LecturerNote,
  LecturerStats,
  LecturerTable,
} from './lecturer-pages';
import { LecturerExamManagement, LecturerExamSubmissions } from './lecturer-exams';

type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  marks: number;
  instructions: string;
  status: 'Published' | 'Draft';
};
type Quiz = {
  id: string;
  title: string;
  course: string;
  type: 'Quiz' | 'Exam';
  status: 'Published' | 'Draft';
  duration: number;
  opens: string;
  closes: string;
  instructions: string;
  questions: { text: string; marks: number; choices: string }[];
};
type Submission = {
  id: string;
  student: string;
  studentId: string;
  course: string;
  title: string;
  type: string;
  date: string;
  mark: string;
  status: 'Awaiting marking' | 'Draft' | 'Ready for review' | 'Submitted for review';
  feedback: string;
  answer: string;
};
const initialAssignments: Assignment[] = [
  {
    id: 'AS-1',
    title: 'Practical ministry reflection',
    course: 'TH201',
    due: '2026-11-28T17:00',
    marks: 100,
    instructions: 'Reflect on the theological principles discussed in class.',
    status: 'Published',
  },
  {
    id: 'AS-2',
    title: 'Leadership in practice',
    course: 'MN202',
    due: '2026-12-03T17:00',
    marks: 100,
    instructions: 'Describe a leadership challenge and your response.',
    status: 'Published',
  },
  {
    id: 'AS-3',
    title: 'Interpreting a passage',
    course: 'BI101',
    due: '2026-12-08T17:00',
    marks: 100,
    instructions: 'Interpret the passage in its context.',
    status: 'Published',
  },
];
const initialQuizzes: Quiz[] = [
  {
    id: 'Q-1',
    title: 'Course knowledge quiz',
    course: 'TH201',
    type: 'Quiz',
    status: 'Published',
    duration: 30,
    opens: '2026-11-22T09:00',
    closes: '2026-11-29T17:00',
    instructions: 'Choose one answer for each question.',
    questions: [
      {
        text: 'What is the first step in theological study?',
        marks: 5,
        choices: 'Read the text in context\nIgnore the audience',
      },
    ],
  },
  {
    id: 'Q-2',
    title: 'Ministry leadership quiz',
    course: 'MN202',
    type: 'Quiz',
    status: 'Published',
    duration: 30,
    opens: '2026-11-23T09:00',
    closes: '2026-11-30T17:00',
    instructions: 'Choose one answer for each question.',
    questions: [
      {
        text: 'Which practice shows responsible leadership?',
        marks: 5,
        choices: 'Serve with integrity\nAvoid accountability',
      },
    ],
  },
];
const initialSubmissions: Submission[] = teachingCourses.flatMap((course, courseIndex) =>
  roster.map((student, studentIndex) => ({
    id: `SUB-${course.code}-${studentIndex}`,
    student: student.name,
    studentId: student.id,
    course: course.code,
    title: ['Practical ministry reflection', 'Course knowledge quiz', 'End-of-unit examination'][
      studentIndex
    ],
    type: ['Assignment', 'Quiz', 'Exam'][studentIndex],
    date: `2026-11-${String(14 - courseIndex - studentIndex).padStart(2, '0')}`,
    mark: '',
    status: 'Awaiting marking' as const,
    feedback: '',
    answer:
      studentIndex === 0
        ? 'My reflection connects the course ideas with service in the local community.'
        : studentIndex === 1
          ? 'Selected answers are ready for review.'
          : 'Course principles guide how a leader plans, communicates and serves.',
  })),
);
const courseName = (code: string) =>
  teachingCourses.find((item) => item.code === code)?.name || code;
const date = (value: string) =>
  value
    ? new Date(value).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Not set';

export function LecturerAssignments() {
  const [rows, setRows] = useState(initialAssignments);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<Assignment | null>(null);
  const [creating, setCreating] = useState(false);
  const visible = rows.filter(
    (row) =>
      (filter === 'All' || row.status === (filter === 'Drafts' ? 'Draft' : 'Published')) &&
      `${row.title} ${row.course}`.toLowerCase().includes(query.toLowerCase()),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Assignment = {
      id: active?.id || `AS-${Date.now()}`,
      title: String(form.get('title')),
      course: String(form.get('course')),
      due: String(form.get('due')),
      marks: Number(form.get('marks')),
      instructions: String(form.get('instructions')),
      status: 'Draft',
    };
    setRows([item, ...rows.filter((row) => row.id !== item.id)]);
    setCreating(false);
    setActive(null);
    setFilter('Drafts');
  }
  return (
    <div className="lp-page">
      <h1>Assignments</h1>
      <LecturerHero
        eyebrow="COURSEWORK"
        title="Set clear tasks. Support better learning."
        copy="Prepare assignment instructions, deadlines and marking requirements."
        action={
          <button
            className="lp-primary"
            onClick={() => {
              setActive(null);
              setCreating(true);
            }}
          >
            + Create assignment
          </button>
        }
      />
      <LecturerStats
        items={[
          ['Total records', rows.length],
          ['Published / active', rows.filter((row) => row.status === 'Published').length],
          ['Private drafts', rows.filter((row) => row.status === 'Draft').length],
        ]}
      />
      <div className="lp-list-toolbar">
        <div className="lp-tabs">
          {['All', 'Published / active', 'Drafts'].map((value) => (
            <button
              className={filter === value ? 'active' : ''}
              key={value}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Search assignments"
          placeholder="Search assignments"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="lp-panel">
        <div className="lp-panel-heading">
          <h2>Assignments</h2>
          <span>{visible.length} records</span>
        </div>
        <LecturerTable headings={['Assignment', 'Course', 'Deadline', 'Status', 'Action']}>
          {visible.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.title}</strong>
              </td>
              <td>{courseName(row.course)}</td>
              <td>{date(row.due)}</td>
              <td>
                <span className="lp-pill">{row.status}</span>
              </td>
              <td>
                <button className="lp-link" onClick={() => setActive(row)}>
                  View →
                </button>
              </td>
            </tr>
          ))}
        </LecturerTable>
        {!visible.length && <div className="lp-empty">No assignments match this view.</div>}
      </section>
      <LecturerNote title="Good teaching practice">
        Include clear instructions, total marks and a submission deadline for every assignment.
      </LecturerNote>
      {active && !creating && (
        <LecturerDialog label="Record details" onClose={() => setActive(null)} wide>
          <button className="lp-link" onClick={() => setActive(null)}>
            ← Back to assignments
          </button>
          <span className="lp-pill">{active.status}</span>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>Course</dt>
              <dd>{courseName(active.course)}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{date(active.due)}</dd>
            </div>
            <div>
              <dt>Total marks</dt>
              <dd>{active.marks}</dd>
            </div>
          </dl>
          <h3>Instructions</h3>
          <p>{active.instructions}</p>
          {active.status === 'Draft' && (
            <div className="lp-actions">
              <button className="lp-outline" onClick={() => setCreating(true)}>
                Edit draft
              </button>
              <button
                className="lp-primary"
                onClick={() => {
                  setRows(
                    rows.map((row) =>
                      row.id === active.id ? { ...row, status: 'Published' } : row,
                    ),
                  );
                  setActive(null);
                }}
              >
                Publish
              </button>
            </div>
          )}
        </LecturerDialog>
      )}
      {creating && (
        <LecturerDialog
          label={active ? 'Edit assignment' : 'Create assignment'}
          onClose={() => {
            setCreating(false);
            setActive(null);
          }}
          wide
        >
          <h2>{active ? 'Edit assignment' : 'Create assignment'}</h2>
          <p className="lp-muted">Prepare the assignment for your course.</p>
          <form className="lp-form" onSubmit={save}>
            <label>
              Title
              <input name="title" required defaultValue={active?.title} />
            </label>
            <label>
              Course
              <select name="course" defaultValue={active?.course || 'TH201'}>
                {teachingCourses.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Assignment instructions
              <textarea name="instructions" rows={5} required defaultValue={active?.instructions} />
            </label>
            <div className="lp-form-grid">
              <label>
                Submission deadline
                <input name="due" type="datetime-local" required defaultValue={active?.due} />
              </label>
              <label>
                Total marks
                <input
                  name="marks"
                  type="number"
                  min="1"
                  required
                  defaultValue={active?.marks || 100}
                />
              </label>
            </div>
            <label>
              Submission format
              <select>
                <option>PDF or Word document</option>
                <option>Written online response</option>
              </select>
            </label>
            <div className="lp-actions">
              <button className="lp-primary" type="submit">
                Save draft
              </button>
              <button
                type="button"
                className="lp-outline"
                onClick={() => {
                  setCreating(false);
                  setActive(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
    </div>
  );
}

export function LecturerQuizzes() {
  const [rows, setRows] = useState(initialQuizzes);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<Quiz | null>(null);
  const [creating, setCreating] = useState(false);
  const [questions, setQuestions] = useState<Quiz['questions']>([
    { text: '', marks: 1, choices: '' },
  ]);
  const visible = rows.filter(
    (row) =>
      (filter === 'All' || row.status === (filter === 'Drafts' ? 'Draft' : 'Published')) &&
      `${row.title} ${row.course}`.toLowerCase().includes(query.toLowerCase()),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item: Quiz = {
      id: active?.id || `Q-${Date.now()}`,
      title: String(data.get('title')),
      course: String(data.get('course')),
      type: 'Quiz',
      status: 'Draft',
      duration: Number(data.get('duration')),
      opens: String(data.get('opens')),
      closes: String(data.get('closes')),
      instructions: String(data.get('instructions')),
      questions,
    };
    setRows([item, ...rows.filter((row) => row.id !== item.id)]);
    setCreating(false);
    setActive(null);
    setFilter('Drafts');
  }
  return (
    <div className="lp-page">
      <h1>Quizzes &amp; Exams</h1>
      <LecturerExamManagement />
      <LecturerExamSubmissions />
      <LecturerHero
        eyebrow="ONLINE ASSESSMENT"
        title="Multiple-choice quizzes"
        copy="Create quizzes using answer choices only. Structured written exams are managed separately above."
        action={
          <button
            className="lp-outline"
            onClick={() => {
              setActive(null);
              setQuestions([{ text: '', marks: 1, choices: '' }]);
              setCreating(true);
            }}
          >
            + Create quiz
          </button>
        }
      />
      <LecturerStats
        items={[
          ['Total records', rows.length],
          ['Published / active', rows.filter((row) => row.status === 'Published').length],
          ['Private drafts', rows.filter((row) => row.status === 'Draft').length],
        ]}
      />
      <div className="lp-list-toolbar">
        <div className="lp-tabs">
          {['All', 'Published / active', 'Drafts'].map((value) => (
            <button
              className={filter === value ? 'active' : ''}
              key={value}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Search quizzes"
          placeholder="Search quizzes & exams"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="lp-panel">
        <div className="lp-panel-heading">
          <h2>Quizzes &amp; Exams</h2>
          <span>{visible.length} records</span>
        </div>
        <LecturerTable headings={['Assessment', 'Course', 'Type', 'Status', 'Action']}>
          {visible.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.title}</strong>
              </td>
              <td>{courseName(row.course)}</td>
              <td>{row.type}</td>
              <td>
                <span className="lp-pill">{row.status}</span>
              </td>
              <td>
                <button className="lp-link" onClick={() => setActive(row)}>
                  View →
                </button>
              </td>
            </tr>
          ))}
        </LecturerTable>
        {!visible.length && <div className="lp-empty">No quizzes match this view.</div>}
      </section>
      <LecturerNote title="Good teaching practice">
        Quizzes move from draft to publication and then to student attempts and marking.
      </LecturerNote>
      {active && !creating && (
        <LecturerDialog label="Record details" onClose={() => setActive(null)} wide>
          <span className="lp-pill">{active.status}</span>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            {[
              ['Course', courseName(active.course)],
              ['Duration', `${active.duration} minutes`],
              ['Opens', date(active.opens)],
              ['Closes', date(active.closes)],
              ['Questions', String(active.questions.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <h3>Assessment instructions</h3>
          <p>{active.instructions}</p>
          <h3>Questions</h3>
          {active.questions.map((question, index) => (
            <article className="lp-question" key={index}>
              <strong>
                {index + 1}. {question.text}
              </strong>
              <p>{question.marks} marks · Multiple choice</p>
              {question.choices.split('\n').map((choice) => (
                <small key={choice}>{choice}</small>
              ))}
            </article>
          ))}
          {active.status === 'Draft' && (
            <div className="lp-actions">
              <button
                className="lp-outline"
                onClick={() => {
                  setQuestions(active.questions);
                  setCreating(true);
                }}
              >
                Edit draft
              </button>
              <button
                className="lp-primary"
                onClick={() => {
                  setRows(
                    rows.map((row) =>
                      row.id === active.id ? { ...row, status: 'Published' } : row,
                    ),
                  );
                  setActive(null);
                }}
              >
                Publish
              </button>
            </div>
          )}
        </LecturerDialog>
      )}
      {creating && (
        <LecturerDialog
          label="Create quiz"
          onClose={() => {
            setCreating(false);
            setActive(null);
          }}
          wide
        >
          <h2>{active ? 'Edit draft' : 'Create quiz'}</h2>
          <p className="lp-muted">
            Create multiple-choice questions, then save the quiz as a draft.
          </p>
          <form className="lp-form" onSubmit={save}>
            <label>
              Title
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
            <div className="lp-form-grid">
              <label>
                Duration (minutes)
                <input
                  name="duration"
                  type="number"
                  min="1"
                  required
                  defaultValue={active?.duration || 30}
                />
              </label>
              <label>
                Opens at
                <input name="opens" type="datetime-local" required defaultValue={active?.opens} />
              </label>
              <label>
                Closes at
                <input name="closes" type="datetime-local" required defaultValue={active?.closes} />
              </label>
            </div>
            <label>
              Assessment instructions
              <textarea name="instructions" rows={3} required defaultValue={active?.instructions} />
            </label>
            <div className="lp-question-heading">
              <h3>Question builder</h3>
              <span>
                {questions.reduce((total, question) => total + Number(question.marks), 0)} total
                marks
              </span>
            </div>
            {questions.map((question, index) => (
              <fieldset className="lp-question" key={index}>
                <legend>Question {index + 1}</legend>
                <label>
                  Question text
                  <textarea
                    required
                    rows={2}
                    value={question.text}
                    onChange={(event) =>
                      setQuestions(
                        questions.map((item, i) =>
                          i === index ? { ...item, text: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <div className="lp-form-grid">
                  <p>Multiple choice · Select one answer</p>
                  <label>
                    Marks
                    <input
                      type="number"
                      min="1"
                      required
                      value={question.marks}
                      onChange={(event) =>
                        setQuestions(
                          questions.map((item, i) =>
                            i === index ? { ...item, marks: Number(event.target.value) } : item,
                          ),
                        )
                      }
                    />
                  </label>
                </div>
                <label>
                  Choices (one per line)
                  <textarea
                    required
                    rows={4}
                    value={question.choices}
                    onChange={(event) =>
                      setQuestions(
                        questions.map((item, i) =>
                          i === index ? { ...item, choices: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Correct choice number (optional)
                  <input type="number" min="1" />
                </label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="lp-link"
                    onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                  >
                    Remove question
                  </button>
                )}
              </fieldset>
            ))}
            <button
              type="button"
              className="lp-outline"
              onClick={() => setQuestions([...questions, { text: '', marks: 1, choices: '' }])}
            >
              + Add question
            </button>
            <div className="lp-actions">
              <button className="lp-primary" type="submit">
                Save draft
              </button>
              <button
                type="button"
                className="lp-outline"
                onClick={() => {
                  setCreating(false);
                  setActive(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
    </div>
  );
}

export function LecturerMarking({ section }: { section: 'Submissions' | 'Marks' }) {
  const [rows, setRows] = useState(initialSubmissions);
  const [course, setCourse] = useState('All courses');
  const [type, setType] = useState('All assessments');
  const [status, setStatus] = useState('All statuses');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Submission | null>(null);
  const [mark, setMark] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const visible = rows.filter(
    (row) =>
      (course === 'All courses' || row.course === course) &&
      (type === 'All assessments' || row.type === type) &&
      (status === 'All statuses' || row.status === status) &&
      `${row.student} ${row.studentId} ${row.title} ${row.course}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const ready = visible.filter((row) => row.status === 'Ready for review');
  function save(next: Submission['status']) {
    if (!active) return;
    const updated = { ...active, mark, feedback, status: next };
    setRows(rows.map((row) => (row.id === active.id ? updated : row)));
    setActive(null);
  }
  return (
    <div className="lp-page">
      <h1>{section}</h1>
      <LecturerHero
        eyebrow="SUBMISSIONS & GRADING"
        title="Review work. Record marks. Submit for review."
        copy="Assignments, quizzes and examinations from your assigned courses."
      />
      <section className="lp-mark-stats">
        {[
          'Awaiting marking',
          'Draft',
          'Ready for review',
          'Submitted for review',
          'Changes requested',
          'Approved for publication',
          'Published',
        ].map((value) => (
          <button
            className={status === value ? 'active' : ''}
            key={value}
            onClick={() => setStatus(status === value ? 'All statuses' : value)}
          >
            <span>{value}</span>
            <strong>{rows.filter((row) => row.status === value).length}</strong>
          </button>
        ))}
      </section>
      <section className="lp-panel">
        <div className="lp-mark-filters">
          <select
            aria-label="Course"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          >
            <option>All courses</option>
            {teachingCourses.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Assessment"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {['All assessments', 'Assignment', 'Quiz', 'Exam'].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            aria-label="Grading status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {[
              'All statuses',
              'Awaiting marking',
              'Draft',
              'Ready for review',
              'Submitted for review',
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <input
            type="search"
            aria-label="Search submissions"
            placeholder="Search student or assessment"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="lp-panel-heading">
          <span>{visible.length} submissions</span>
          <button
            className="lp-primary"
            disabled={!ready.length}
            onClick={() => setConfirmation(true)}
          >
            Submit ready results ({ready.length})
          </button>
        </div>
        <LecturerTable
          headings={['Student', 'Assessment', 'Submitted', 'Mark', 'Status', 'Action']}
        >
          {visible.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.student}</strong>
                <small>{row.studentId}</small>
              </td>
              <td>
                <strong>{row.title}</strong>
                <small>
                  {row.course} · {row.type}
                </small>
              </td>
              <td>
                {row.date}
                <small>On time</small>
              </td>
              <td>{row.mark ? `${row.mark} / 100` : '—'}</td>
              <td>
                <span className="lp-pill">{row.status}</span>
              </td>
              <td>
                <button
                  className="lp-link"
                  onClick={() => {
                    setActive(row);
                    setMark(row.mark);
                    setFeedback(row.feedback);
                  }}
                >
                  Review &amp; mark →
                </button>
              </td>
            </tr>
          ))}
        </LecturerTable>
        {!visible.length && <div className="lp-empty">No submissions match your filters.</div>}
      </section>
      <p className="lp-footnote">
        Draft → Ready for review → Head of Programs approval → Secretariat publication → Student
        results.
      </p>
      {active && (
        <LecturerDialog label="Review submission" onClose={() => setActive(null)} wide>
          <div className="lp-mark-title">
            <div>
              <h2>{active.student}</h2>
              <p>
                {active.studentId} · {active.course} · {active.type}
              </p>
              <strong>{active.title}</strong>
              <p>Submitted {active.date}</p>
            </div>
            <span className="lp-pill">{active.status}</span>
          </div>
          <div className="lp-mark-review">
            <section>
              <h3>Submitted work</h3>
              <p>{active.answer}</p>
            </section>
            <section>
              <h3>Mark &amp; feedback</h3>
              <form
                className="lp-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  save('Ready for review');
                }}
              >
                <label>
                  Mark (out of 100)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={mark}
                    onChange={(event) => setMark(event.target.value)}
                  />
                </label>
                <label>
                  Feedback
                  <textarea
                    rows={5}
                    required
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    placeholder="Explain strengths and areas to improve."
                  />
                </label>
                <div className="lp-actions">
                  <button type="button" className="lp-outline" onClick={() => save('Draft')}>
                    Save draft
                  </button>
                  <button type="submit" className="lp-primary">
                    Mark ready
                  </button>
                </div>
              </form>
            </section>
          </div>
        </LecturerDialog>
      )}
      {confirmation && (
        <LecturerDialog
          label="Submit results for academic review"
          onClose={() => setConfirmation(false)}
        >
          <h2>Submit {ready.length} ready results?</h2>
          <p>Results in the current filtered view will be locked for academic review.</p>
          <ul>
            {ready.map((row) => (
              <li key={row.id}>
                {row.student} · {row.course} · {row.mark}/100
              </li>
            ))}
          </ul>
          <div className="lp-actions">
            <button className="lp-outline" onClick={() => setConfirmation(false)}>
              Cancel
            </button>
            <button
              className="lp-primary"
              onClick={() => {
                const ids = new Set(ready.map((row) => row.id));
                setRows(
                  rows.map((row) =>
                    ids.has(row.id) ? { ...row, status: 'Submitted for review' } : row,
                  ),
                );
                setConfirmation(false);
              }}
            >
              Submit for review
            </button>
          </div>
        </LecturerDialog>
      )}
    </div>
  );
}
