'use client';

import { useState, type FormEvent } from 'react';
import { portalHref, roles, type RoleSlug } from '@/lib/demo-data';
import type { EventRecord } from '@/lib/workflows';
import { useWorkflows } from '@/components/providers/workflow-provider';
import { StudentModal } from '@/components/student/student-modal';

const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Blantyre',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
const formatDate = (value: string) =>
  new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
const formatTime = (value: string) => value.slice(11, 16) || 'Time to be confirmed';

function calendarDays(month: string) {
  const [year, number] = month.split('-').map(Number);
  const offset = (new Date(year, number - 1, 1, 12).getDay() + 6) % 7;
  const count = new Date(year, number, 0).getDate();
  const length = Math.ceil((offset + count) / 7) * 7;
  return Array.from({ length }, (_, index) => {
    const day = index - offset + 1;
    return day < 1 || day > count ? null : `${month}-${String(day).padStart(2, '0')}`;
  });
}

export function EventsWorkspace({ role, section }: { role: RoleSlug; section: string }) {
  const { state, dispatch } = useWorkflows();
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [audience, setAudience] = useState('All');
  const [body, setBody] = useState('');
  const [spoc, setSpoc] = useState('');
  const canCreate = ['administration', 'lecturer', 'secretariat', 'head-of-hosom'].includes(role);
  const permitted = state.events.filter((event) =>
    role === 'student' ? ['All', 'Students'].includes(event.audience) : true,
  );
  const term = search.trim().toLowerCase();
  const visible = permitted
    .filter((event) =>
      [event.title, event.location, event.body, event.author, event.spoc, event.audience].some(
        (value) => value?.toLowerCase().includes(term),
      ),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const active: EventRecord | undefined = permitted.find((event) => event.id === activeId);
  const monthLabel = new Date(`${month}-01T12:00:00`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
  const days = calendarDays(month);
  const eventsByDay = new Map<string, EventRecord[]>();
  visible.forEach((event) => {
    const day = event.date.slice(0, 10);
    eventsByDay.set(day, [...(eventsByDay.get(day) ?? []), event]);
  });

  function moveMonth(step: number) {
    const [year, number] = month.split('-').map(Number);
    const next = new Date(year, number - 1 + step, 1, 12);
    setMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !date || !location.trim() || !body.trim() || !spoc.trim()) return;
    dispatch({
      type: 'event/add',
      title: title.trim(),
      date,
      location: location.trim(),
      audience,
      author: roles[role].label,
      body: body.trim(),
      spoc: spoc.trim(),
    });
    setTitle('');
    setDate('');
    setLocation('');
    setBody('');
    setSpoc('');
    setAudience('All');
    setCreating(false);
  }

  return (
    <div className="events-workspace">
      {section === 'Operations' && (
        <div className="flow-grid">
          <article className="flow-card">
            <div className="flow-card-icon">▧</div>
            <h3>Announcements</h3>
            <p>Publish updates to staff, students or everyone.</p>
            <div className="flow-actions">
              <a className="flow-outline" href={portalHref(role, 'Announcements')}>
                Open announcements →
              </a>
            </div>
          </article>
          <article className="flow-card">
            <div className="flow-card-icon">▣</div>
            <h3>Events</h3>
            <p>Coordinate meetings, classes and school activities.</p>
            <div className="flow-actions">
              <a className="flow-outline" href={portalHref(role, 'Events')}>
                Open event calendar →
              </a>
            </div>
          </article>
        </div>
      )}
      <section className="events-panel">
        <div className="events-heading">
          <div>
            <p className="eyebrow">
              {canCreate ? `${roles[role].label} / Operations` : 'Institutional messages'}
            </p>
            <h2>Events</h2>
            <p>Plan events, coordinate representatives and follow upcoming dates.</p>
          </div>
          {canCreate && (
            <button className="events-primary" type="button" onClick={() => setCreating(true)}>
              + New event
            </button>
          )}
        </div>
        <p className="events-local-note">
          Shared in this browser. Email and external notifications are not connected.
        </p>
        <label className="events-search">
          Search events
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events…"
          />
        </label>
        <div className="events-message-list">
          {visible.length ? (
            visible.map((event) => (
              <button
                type="button"
                className="events-message-row"
                key={event.id}
                onClick={() => setActiveId(event.id)}
              >
                <span className="events-message-icon" aria-hidden="true">
                  ▦
                </span>
                <span className="events-message-content">
                  <strong>{event.title}</strong>
                  <span>{event.body || event.location}</span>
                  <small>
                    SPOC: {event.spoc || event.author} · {event.author} ·{' '}
                    {event.audience === 'All' ? 'All users' : event.audience}
                  </small>
                </span>
                <span className="events-message-date">
                  Due {formatDate(event.date)}
                  <small>{formatTime(event.date)}</small>
                </span>
              </button>
            ))
          ) : (
            <div className="events-empty">
              <h3>No events{term ? ' match your search' : ' yet'}</h3>
              <p>
                {term ? 'Try another search term.' : 'Events addressed to you will appear here.'}
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="events-panel events-calendar" aria-label="Events calendar">
        <div className="events-heading">
          <div>
            <h2>Events calendar</h2>
            <p>Events appear on their due date.</p>
          </div>
          <div className="events-calendar-actions">
            <button
              type="button"
              className="events-outline"
              onClick={() => moveMonth(-1)}
              aria-label="Previous month"
            >
              ←
            </button>
            <label>
              Month
              <input
                type="month"
                value={month}
                onChange={(event) => {
                  if (event.target.value) setMonth(event.target.value);
                }}
              />
            </label>
            <button
              type="button"
              className="events-outline"
              onClick={() => setMonth(today().slice(0, 7))}
            >
              Today
            </button>
            <button
              type="button"
              className="events-outline"
              onClick={() => moveMonth(1)}
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </div>
        <h3 aria-live="polite">{monthLabel}</h3>
        <div className="events-calendar-scroll">
          <div className="events-calendar-grid" role="grid" aria-label={monthLabel}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div className="events-weekday" role="columnheader" key={day}>
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div
                role="gridcell"
                aria-label={day ? formatDate(day) : 'Outside this month'}
                className={`events-day${day ? '' : ' events-day-empty'}${day === today() ? ' events-day-today' : ''}`}
                key={day ?? `empty-${index}`}
              >
                {day && (
                  <>
                    <span className="events-day-number">{Number(day.slice(-2))}</span>
                    {(eventsByDay.get(day) ?? []).map((event) => (
                      <button
                        type="button"
                        key={event.id}
                        className="events-calendar-event"
                        onClick={() => setActiveId(event.id)}
                        title={event.title}
                      >
                        {event.title}
                      </button>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {!visible.some((event) => event.date.startsWith(month)) && (
          <p className="events-calendar-empty">No events scheduled for this month.</p>
        )}
      </section>
      {active && (
        <StudentModal
          label={active.title}
          onClose={() => setActiveId(null)}
          className="events-dialog"
        >
          <button
            type="button"
            className="student-feature-close"
            aria-label="Close event"
            onClick={() => setActiveId(null)}
          >
            ×
          </button>
          <p className="eyebrow">EVENT · {active.id}</p>
          <h2>{active.title}</h2>
          <dl className="events-detail-meta">
            <div>
              <dt>SPOC</dt>
              <dd>{active.spoc || active.author}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>
                {formatDate(active.date)} · {formatTime(active.date)}
              </dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{active.author}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{active.location}</dd>
            </div>
          </dl>
          <span className="events-recipient">
            {active.audience === 'All' ? 'All users' : active.audience}
          </span>
          {active.body && <p className="events-detail-body">{active.body}</p>}
        </StudentModal>
      )}
      {creating && (
        <StudentModal
          label="Create event"
          onClose={() => setCreating(false)}
          className="events-dialog"
        >
          <button
            type="button"
            className="student-feature-close"
            aria-label="Close event form"
            onClick={() => setCreating(false)}
          >
            ×
          </button>
          <form onSubmit={createEvent}>
            <p className="eyebrow">OPERATIONS / EVENTS</p>
            <h2>New event</h2>
            <label>
              Event title
              <input
                required
                maxLength={180}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
            </label>
            <div className="events-form-grid">
              <label>
                SPOC — single point of contact
                <input
                  required
                  value={spoc}
                  onChange={(event) => setSpoc(event.target.value)}
                  placeholder="Representative name"
                />
              </label>
              <label>
                Due date and time
                <input
                  required
                  type="datetime-local"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
            </div>
            <label>
              Recipients
              <select value={audience} onChange={(event) => setAudience(event.target.value)}>
                {['All', 'Students', 'Staff', 'Lecturers'].map((value) => (
                  <option key={value} value={value}>
                    {value === 'All' ? 'All users' : value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Location or meeting link
              <input
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Event details"
              />
            </label>
            <div className="events-form-actions">
              <button type="button" className="events-outline" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button type="submit" className="events-primary">
                Create event
              </button>
            </div>
          </form>
        </StudentModal>
      )}
    </div>
  );
}
