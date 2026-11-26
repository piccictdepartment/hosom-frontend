'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courses, portalHref } from '@/lib/demo-data';

const filters = ['All courses', 'In progress', 'Completed'] as const;
type Filter = (typeof filters)[number];

export function StudentCourses() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All courses');
  const visible = courses.filter(
    (course) =>
      `${course.name} ${course.code}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'All courses' ||
        (filter === 'Completed' ? course.progress === 100 : course.progress < 100)),
  );
  const average = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0;

  return (
    <div className="student-courses-page">
      <h1 className="sc-page-title">My Courses</h1>
      <section className="courses-intro">
        <div>
          <span className="courses-kicker">YOUR LEARNING JOURNEY</span>
          <h2>Learn with purpose. Grow in your calling.</h2>
          <p>
            Access your enrolled courses, revisit learning materials and keep track of your
            progress.
          </p>
        </div>
        <div className="courses-overall">
          <strong>{average}%</strong>
          <span>Overall course progress</span>
        </div>
      </section>
      <section className="courses-summary" aria-label="Course summary">
        <div>
          <span>Enrolled courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div>
          <span>In progress</span>
          <strong>{courses.filter((course) => course.progress < 100).length}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{courses.filter((course) => course.progress === 100).length}</strong>
        </div>
      </section>
      <div className="courses-toolbar">
        <div className="courses-tabs" role="group" aria-label="Filter courses">
          {filters.map((label) => (
            <button
              key={label}
              type="button"
              className={filter === label ? 'active' : ''}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="courses-search"
          type="search"
          aria-label="Search enrolled courses"
          placeholder="Search by course name or code"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="enrolled-course-grid" aria-label="Enrolled courses">
        {visible.length ? (
          visible.map((course, index) => (
            <article className="enrolled-course-card" key={course.code}>
              <div className={`course-card-cover cover-${index % 3}`}>
                <span className="course-code">{course.code}</span>
                <span className="course-monogram" aria-hidden="true">
                  {course.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div className="course-card-body">
                <span className="course-status">
                  {course.progress === 100 ? 'Completed' : course.status}
                </span>
                <h3>{course.name}</h3>
                <p className="course-card-description">
                  Study materials, course activities and learning resources.
                </p>
                <div className="course-progress-label">
                  <span>Course progress</span>
                  <strong>{course.progress}%</strong>
                </div>
                <div
                  className="course-progress-track"
                  role="progressbar"
                  aria-label={`${course.name} progress`}
                  aria-valuenow={course.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: `${course.progress}%` }} />
                </div>
                <Link className="course-continue" href={portalHref('student', 'Learning Space')}>
                  {course.progress === 100 ? 'Review course →' : 'Continue learning →'}
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="courses-empty">
            <h3>No courses found</h3>
            <p>
              {filter === 'Completed'
                ? 'Your completed courses will appear here.'
                : 'Try a different course name or choose another filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('All courses');
              }}
            >
              View all courses
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
