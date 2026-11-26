'use client';

import { useState } from 'react';
import Link from 'next/link';
import { lecturerTeachingCourses, portalHref } from '@/lib/demo-data';
import { StudentModal } from '@/components/student/student-modal';

const assignedCourses = lecturerTeachingCourses;
const sections = [
  'Materials',
  'Assignments',
  'Quizzes & Exams',
  'Marks',
  'Attendance',
  'Announcements',
];

export function LecturerCourses() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [drafts, setDrafts] = useState<
    { id: string; name: string; category: string; notes: string }[]
  >([]);
  const selected = assignedCourses.find((course) => course.code === selectedCode);
  const visible = assignedCourses.filter(
    (course) =>
      `${course.code} ${course.name}`.toLowerCase().includes(query.toLowerCase()) &&
      filter !== 'Drafts',
  );
  const visibleDrafts = drafts.filter(
    (draft) =>
      draft.name.toLowerCase().includes(query.toLowerCase()) && filter !== 'Published / active',
  );

  return (
    <div className="lecturer-courses-page">
      <div className="lecturer-courses-page-heading">
        <h1>My Courses</h1>
        <button type="button" onClick={() => setCreating(true)}>
          + Add new
        </button>
      </div>
      <section className="lecturer-courses-hero">
        <span>COURSE DELIVERY</span>
        <h2>Your courses. Your teaching impact.</h2>
        <p>Review assigned courses, enrolled students and delivery details.</p>
      </section>
      <section className="lecturer-courses-summary" aria-label="Course summary">
        <div>
          <span>Assigned courses</span>
          <strong>{assignedCourses.length}</strong>
        </div>
        <div>
          <span>Published / active</span>
          <strong>{assignedCourses.length}</strong>
        </div>
        <div>
          <span>Private drafts</span>
          <strong>{drafts.length}</strong>
        </div>
      </section>
      <div className="lecturer-courses-toolbar">
        <div className="lecturer-courses-tabs" role="group" aria-label="Record status">
          {['All', 'Published / active', 'Drafts'].map((label) => (
            <button
              type="button"
              key={label}
              aria-pressed={filter === label}
              className={filter === label ? 'active' : ''}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Search My Courses"
          placeholder="Search my courses"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="lecturer-courses-panel">
        <div className="lecturer-courses-heading">
          <h2>My Courses</h2>
          <span>{visible.length + visibleDrafts.length} records</span>
        </div>
        {visible.length || visibleDrafts.length ? (
          <div className="lecturer-courses-table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col">Cohort</th>
                  <th scope="col">Students</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((course) => (
                  <tr key={course.code}>
                    <td>
                      <strong>{course.name}</strong>
                    </td>
                    <td>{course.cohort}</td>
                    <td>{course.students}</td>
                    <td>
                      <span className="lecturer-courses-status">Active</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="lecturer-courses-view"
                        onClick={() => setSelectedCode(course.code)}
                        aria-label={`View ${course.name}`}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleDrafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>
                      <strong>{draft.name}</strong>
                      <small>{draft.category}</small>
                    </td>
                    <td>—</td>
                    <td>—</td>
                    <td>
                      <span className="lecturer-courses-status draft">Draft</span>
                    </td>
                    <td>
                      <span className="lecturer-courses-draft-note">Private record</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="lecturer-courses-empty">
            <h3>
              {query
                ? 'No matching records'
                : filter === 'Drafts'
                  ? 'No course drafts'
                  : 'No assigned courses yet'}
            </h3>
            <p>
              {query
                ? 'Adjust your search or choose another filter.'
                : 'Course assignments from the academic office will appear here.'}
            </p>
          </div>
        )}
      </section>
      <aside className="lecturer-courses-guidance">
        <strong>Good teaching practice</strong>
        <p>
          Course assignments are managed by the academic office. Select a course to review its
          teaching details.
        </p>
      </aside>
      {selected && (
        <StudentModal
          label={`${selected.name} course details`}
          onClose={() => setSelectedCode(null)}
          className="lecturer-course-dialog"
        >
          <div className="lecturer-course-dialog-heading">Record details</div>
          <button
            type="button"
            className="lecturer-course-back"
            onClick={() => setSelectedCode(null)}
          >
            ← Back to my courses
          </button>
          <button
            type="button"
            className="student-feature-close"
            aria-label="Close course details"
            onClick={() => setSelectedCode(null)}
          >
            ×
          </button>
          <span className="lecturer-courses-status">Active</span>
          <h2>{selected.name}</h2>
          <dl>
            <div>
              <dt>Course Code</dt>
              <dd>{selected.code}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Active</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{selected.name}</dd>
            </div>
            <div>
              <dt>Title</dt>
              <dd>{selected.name}</dd>
            </div>
            <div>
              <dt>Code</dt>
              <dd>{selected.code}</dd>
            </div>
            <div>
              <dt>Lecturer</dt>
              <dd>Daniel Phiri</dd>
            </div>
          </dl>
          <details className="lecturer-course-more">
            <summary>More details</summary>
            <p>
              Cohort: {selected.cohort} · Enrolled students: {selected.students}
            </p>
          </details>
          <div className="lecturer-course-links">
            {sections.map((section) => (
              <Link key={section} href={portalHref('lecturer', section)}>
                {section} →
              </Link>
            ))}
          </div>
        </StudentModal>
      )}
      {creating && (
        <StudentModal
          label="New My Courses"
          onClose={() => setCreating(false)}
          className="lecturer-course-create"
        >
          <button
            className="student-feature-close"
            type="button"
            aria-label="Close form"
            onClick={() => setCreating(false)}
          >
            ×
          </button>
          <span>CREATE</span>
          <h2>New My Courses</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setDrafts((items) => [
                ...items,
                {
                  id: `course-draft-${items.length + 1}`,
                  name: String(data.get('name') || '').trim(),
                  category: String(data.get('category') || 'Standard'),
                  notes: String(data.get('notes') || ''),
                },
              ]);
              setCreating(false);
            }}
          >
            <label>
              Record name
              <input name="name" required placeholder="Enter a name" />
            </label>
            <label>
              Category
              <select name="category">
                <option>Standard</option>
                <option>Priority</option>
                <option>Requires review</option>
              </select>
            </label>
            <label>
              Notes
              <textarea name="notes" rows={3} placeholder="Optional notes" />
            </label>
            <div>
              <button type="button" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button type="submit">Save record</button>
            </div>
          </form>
        </StudentModal>
      )}
    </div>
  );
}
