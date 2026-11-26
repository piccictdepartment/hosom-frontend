'use client';

import { useState, type FormEvent } from 'react';
import {
  teachingCourses,
  LecturerDialog,
  LecturerHero,
  LecturerNote,
  LecturerStats,
  LecturerTable,
} from './lecturer-pages';

type Message = {
  id: string;
  title: string;
  body: string;
  audience: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  priority?: string;
  course?: string;
};
const initialCourseMessages: Message[] = [
  {
    id: 'CA-1',
    title: 'New study guide for Foundations of Theology',
    body: 'The study guide for our next unit is available in Materials. Please read it before class.',
    audience: 'TH201',
    course: 'TH201',
    author: 'Daniel Phiri',
    date: '2026-11-18',
    status: 'Published',
  },
  {
    id: 'CA-2',
    title: 'Ministry Leadership seminar reminder',
    body: 'Please prepare your short reflection before the upcoming seminar.',
    audience: 'MN202',
    course: 'MN202',
    author: 'Daniel Phiri',
    date: '2026-11-16',
    status: 'Published',
  },
];
const initialAnnouncements: Message[] = [
  {
    id: 'AN-1',
    title: 'Semester 2 academic calendar published',
    body: 'The academic calendar for Semester 2 is now available. Review class and assessment dates.',
    audience: 'All users',
    author: 'Academic office',
    date: '2026-11-12',
    status: 'Published',
  },
  {
    id: 'AN-2',
    title: 'Student support hours this week',
    body: 'The student support team will be available during normal office hours this week.',
    audience: 'Lecturers',
    author: 'Secretariat',
    date: '2026-11-08',
    status: 'Published',
  },
];

export function LecturerCourseAnnouncements() {
  const [rows, setRows] = useState(initialCourseMessages);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<Message | null>(null);
  const [creating, setCreating] = useState(false);
  const visible = rows.filter(
    (row) =>
      (filter === 'All' || row.status === (filter === 'Drafts' ? 'Draft' : 'Published')) &&
      `${row.title} ${row.body} ${row.course}`.toLowerCase().includes(query.toLowerCase()),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Message = {
      id: active?.id || `CA-${Date.now()}`,
      title: String(form.get('title')),
      body: String(form.get('body')),
      audience: String(form.get('course')),
      course: String(form.get('course')),
      priority: String(form.get('priority')),
      author: 'Daniel Phiri',
      date: String(form.get('date')) || 'Not scheduled',
      status: 'Draft',
    };
    setRows([item, ...rows.filter((row) => row.id !== item.id)]);
    setCreating(false);
    setActive(null);
    setFilter('Drafts');
  }
  return (
    <div className="lp-page">
      <h1>Course Announcements</h1>
      <LecturerHero
        eyebrow="COURSE COMMUNICATION"
        title="Keep your students informed."
        copy="Prepare course updates, reminders and important teaching notices."
        action={
          <button
            className="lp-primary"
            onClick={() => {
              setActive(null);
              setCreating(true);
            }}
          >
            + Write announcement
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
          aria-label="Search course announcements"
          type="search"
          placeholder="Search announcements"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="lp-panel">
        <div className="lp-panel-heading">
          <h2>Announcements</h2>
          <span>{visible.length} records</span>
        </div>
        <LecturerTable headings={['Announcement', 'Audience', 'Date', 'Status', 'Action']}>
          {visible.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.title}</strong>
              </td>
              <td>{row.course}</td>
              <td>{row.date}</td>
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
        {!visible.length && <p className="lp-empty">No announcements match this view.</p>}
      </section>
      <LecturerNote title="Good teaching practice">
        Choose the right course audience and check your message before publishing.
      </LecturerNote>
      {active && !creating && (
        <LecturerDialog label="Record details" onClose={() => setActive(null)} wide>
          <span className="lp-pill">{active.status}</span>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>Course</dt>
              <dd>{active.course}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{active.priority || 'Standard'}</dd>
            </div>
            <div>
              <dt>Publication date</dt>
              <dd>{active.date}</dd>
            </div>
          </dl>
          <h3>Message</h3>
          <p>{active.body}</p>
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
          label={active ? 'Edit draft' : 'Write announcement'}
          onClose={() => {
            setCreating(false);
            setActive(null);
          }}
          wide
        >
          <h2>{active ? 'Edit draft' : 'Write announcement'}</h2>
          <form className="lp-form" onSubmit={save}>
            <label>
              Title
              <input name="title" required defaultValue={active?.title} />
            </label>
            <label>
              Course / audience
              <select name="course" defaultValue={active?.course || 'TH201'}>
                {teachingCourses.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select name="priority" defaultValue={active?.priority || 'Standard'}>
                {['Standard', 'Important', 'Urgent'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea name="body" rows={5} required defaultValue={active?.body} />
            </label>
            <label>
              Planned publication date
              <input name="date" type="date" defaultValue={active?.date} />
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

export function LecturerAnnouncements() {
  const [rows, setRows] = useState(initialAnnouncements);
  const [box, setBox] = useState('Received');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Message | null>(null);
  const [creating, setCreating] = useState(false);
  const visible = rows.filter(
    (row) =>
      (box === 'Sent' ? row.author === 'Daniel Phiri' : row.author !== 'Daniel Phiri') &&
      `${row.title} ${row.body} ${row.author}`.toLowerCase().includes(query.toLowerCase()),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Message = {
      id: `AN-${Date.now()}`,
      title: String(form.get('title')),
      body: String(form.get('body')),
      audience: String(form.get('audience')),
      author: 'Daniel Phiri',
      date: String(form.get('date')),
      status: 'Published',
    };
    setRows([item, ...rows]);
    setBox('Sent');
    setActive(item);
    setCreating(false);
  }
  return (
    <div className="lp-page">
      <h1>Announcements</h1>
      <section className="lp-panel lp-message-panel">
        <div className="lp-panel-heading">
          <div>
            <span className="lp-kicker">LECTURER / OPERATIONS</span>
            <h2>Announcements</h2>
            <p>News, updates and messages for the institution.</p>
          </div>
          <button className="lp-primary" onClick={() => setCreating(true)}>
            + New announcement
          </button>
        </div>
        <div className="lp-tabs">
          {['Received', 'Sent'].map((value) => (
            <button
              key={value}
              className={box === value ? 'active' : ''}
              onClick={() => setBox(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="lp-muted">
          {box === 'Sent'
            ? 'Announcements you created.'
            : 'Announcements addressed to you and your department appear here.'}
        </p>
        <label className="lp-search-label">
          Search announcements
          <input
            type="search"
            placeholder="Search announcements…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="lp-message-list">
          {visible.map((row) => (
            <button key={row.id} onClick={() => setActive(row)}>
              <span className="lp-message-icon">✉</span>
              <span>
                <strong>{row.title}</strong>
                <span>{row.body}</span>
                <small>
                  SPOC: {row.author} · {row.audience}
                </small>
              </span>
              <em>{row.date}</em>
            </button>
          ))}
          {!visible.length && <p className="lp-empty">No announcements yet.</p>}
        </div>
      </section>
      {active && (
        <LecturerDialog label={active.title} onClose={() => setActive(null)}>
          <span className="lp-kicker">ANNOUNCEMENT · {active.id}</span>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>SPOC</dt>
              <dd>{active.author}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>{active.date}</dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{active.author}</dd>
            </div>
          </dl>
          <span className="lp-pill">{active.audience}</span>
          <p>{active.body}</p>
        </LecturerDialog>
      )}
      {creating && (
        <LecturerDialog label="New announcement" onClose={() => setCreating(false)} wide>
          <span className="lp-kicker">OPERATIONS / ANNOUNCEMENTS</span>
          <h2>New announcement</h2>
          <form className="lp-form" onSubmit={save}>
            <label>
              Announcement title
              <input name="title" required />
            </label>
            <div className="lp-form-grid">
              <label>
                SPOC — single point of contact
                <select>
                  <option>Dr. Daniel Phiri · Lecturer</option>
                  <option>Academic office</option>
                </select>
              </label>
              <label>
                Due date
                <input name="date" type="date" required />
              </label>
            </div>
            <label>
              Recipients
              <select name="audience">
                <option>All users</option>
                <option>Lecturers</option>
                <option>Students</option>
                <option>Ministry and Theology</option>
              </select>
            </label>
            <label>
              Message
              <textarea name="body" rows={5} required />
            </label>
            <label>
              Attach files (optional)
              <input type="file" multiple />
            </label>
            <div className="lp-actions">
              <button className="lp-outline" type="button" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button className="lp-primary" type="submit">
                Create announcement
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
    </div>
  );
}

type Notice = {
  id: string;
  title: string;
  audience: string;
  date: string;
  status: string;
  body: string;
  category: string;
};
const records: Record<string, Notice[]> = {
  Notifications: [
    {
      id: 'NT-1',
      title: 'New material added to Biblical Interpretation',
      audience: 'Lecturer',
      date: '2026-11-18',
      status: 'Unread',
      body: 'A new learning resource is available for Biblical Interpretation.',
      category: 'New learning material',
    },
    {
      id: 'NT-2',
      title: 'Academic calendar updated for December',
      audience: 'All users',
      date: '2026-11-17',
      status: 'Unread',
      body: 'Review the revised December academic calendar.',
      category: 'New announcement',
    },
  ],
  'Academic Updates': [
    {
      id: 'AU-1',
      title: 'Semester 2 academic calendar',
      audience: 'All users',
      date: '2026-11-12',
      status: 'Published',
      body: 'Class and assessment dates have been updated.',
      category: 'Academic',
    },
  ],
  Communications: [
    {
      id: 'CM-1',
      title: 'Course support request',
      audience: 'Academic office',
      date: '2026-11-14',
      status: 'Available',
      body: 'A course support request is available for review.',
      category: 'Course support',
    },
  ],
};
export function LecturerMessages({
  section,
}: {
  section: 'Notifications' | 'Academic Updates' | 'Communications';
}) {
  const [items, setItems] = useState(records[section]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All categories');
  const [active, setActive] = useState<Notice | null>(null);
  const [creating, setCreating] = useState(false);
  const visible = items.filter(
    (row) =>
      `${row.title} ${row.body} ${row.audience}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'All' || filter === 'Official' || row.status === filter) &&
      (category === 'All categories' || row.category === category),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Notice = {
      id: `MSG-${Date.now()}`,
      title: String(form.get('title')),
      body: String(form.get('body')),
      audience: String(form.get('audience')),
      date: new Date().toISOString().slice(0, 10),
      status: 'Private draft',
      category: section,
    };
    setItems([item, ...items]);
    setCreating(false);
  }
  return (
    <div className="lp-page">
      <h1>{section}</h1>
      <LecturerHero
        eyebrow="LECTURER"
        title={
          section === 'Academic Updates'
            ? 'Academic updates'
            : section === 'Communications'
              ? 'Student communications'
              : 'Notifications'
        }
        copy={
          section === 'Academic Updates'
            ? 'Registration dates, academic calendar changes and programme updates.'
            : section === 'Communications'
              ? 'Prepare enquiries and messages for the appropriate academic office.'
              : 'Review alerts and keep track of updates requiring your attention.'
        }
        action={
          section !== 'Notifications' ? (
            <button className="lp-primary" onClick={() => setCreating(true)}>
              Prepare {section === 'Communications' ? 'message' : 'draft'}
            </button>
          ) : null
        }
      />
      <LecturerStats
        items={[
          ['Available records', items.length],
          ['Private drafts', items.filter((row) => row.status === 'Private draft').length],
          ['Unread records', items.filter((row) => row.status === 'Unread').length],
        ]}
      />
      <div className="lp-filters">
        <select
          aria-label="Communication category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {['All categories', ...new Set(items.map((row) => row.category))].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <input
          type="search"
          aria-label={`Search ${section}`}
          placeholder={`Search ${section.toLowerCase()}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Record filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          {['All', 'Official', 'Private draft', 'Unread'].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <section className="lp-panel">
        <LecturerTable
          headings={['Title / record', 'Audience / owner', 'Date', 'Status', 'Action']}
        >
          {visible.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.title}</strong>
              </td>
              <td>{row.audience}</td>
              <td>{row.date}</td>
              <td>
                <span className="lp-pill">{row.status}</span>
              </td>
              <td>
                <button
                  className="lp-link"
                  onClick={() => {
                    setActive(row);
                    if (row.status === 'Unread')
                      setItems(
                        items.map((item) =>
                          item.id === row.id ? { ...item, status: 'Read' } : item,
                        ),
                      );
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </LecturerTable>
        {!visible.length && <p className="lp-empty">No matching records.</p>}
      </section>
      <LecturerNote title="Workspace status">
        Messages and drafts are shown for this UI preview.
      </LecturerNote>
      {active && (
        <LecturerDialog label="Record details" onClose={() => setActive(null)}>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>Audience</dt>
              <dd>{active.audience}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{active.date}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{active.status}</dd>
            </div>
          </dl>
          <p>{active.body}</p>
        </LecturerDialog>
      )}
      {creating && (
        <LecturerDialog label="New draft" onClose={() => setCreating(false)}>
          <h2>New draft</h2>
          <form className="lp-form" onSubmit={save}>
            <label>
              Title
              <input name="title" required />
            </label>
            <label>
              Recipient / audience
              <input name="audience" required />
            </label>
            {section === 'Academic Updates' ? (
              <label>
                Effective date
                <input type="date" />
              </label>
            ) : (
              <label>
                Topic
                <select>
                  <option>General enquiry</option>
                  <option>Course support</option>
                  <option>Enrollment</option>
                  <option>Results</option>
                </select>
              </label>
            )}
            <label>
              Message
              <textarea name="body" rows={5} required />
            </label>
            <div className="lp-actions">
              <button className="lp-primary" type="submit">
                Save private draft
              </button>
              <button className="lp-outline" type="button" onClick={() => setCreating(false)}>
                Cancel
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
    </div>
  );
}
