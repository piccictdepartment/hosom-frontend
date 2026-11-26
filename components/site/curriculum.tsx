const modules = [
  [
    'Principles of success in leadership',
    'Foundational principles that shape healthy leadership and long-term impact.',
    'compass',
  ],
  [
    'The making of a leader',
    'How leaders are formed through calling, process, and faithful stewardship.',
    'growth',
  ],
  [
    'The character of a leader',
    'Integrity, humility, and consistency—the inner life that sustains ministry.',
    'shield',
  ],
  [
    'The family of a leader',
    'Building a strong home and healthy relationships while serving faithfully.',
    'home',
  ],
  [
    'The spiritual life of a leader',
    'Prayer, the Word, and devotion as the source of strength and direction.',
    'book',
  ],
  [
    'Principles and power of vision',
    'Developing, communicating, and pursuing God-given vision with clarity.',
    'eye',
  ],
  [
    'Maximizing your potential',
    'Discovering gifts and developing skills for excellence in service.',
    'spark',
  ],
  [
    'Work ethic of a leader',
    'Discipline, diligence, and consistency in ministry responsibilities.',
    'tools',
  ],
  [
    'How God speaks',
    'Hearing and obeying God through Scripture, the Spirit, and wisdom.',
    'message',
  ],
  ['Loyalty in Ministry', 'Faithfulness, honor, and unity—serving with a loyal spirit.', 'heart'],
  [
    'How to start a church from scratch',
    'Practical steps for church planting and building a healthy ministry foundation.',
    'church',
  ],
  [
    'The Holy Spirit',
    'Understanding the Spirit’s work, empowerment, and guidance in ministry.',
    'flame',
  ],
  [
    'Ladders of excellence in Ministry',
    'Growing through levels of maturity, responsibility, and proven faithfulness.',
    'steps',
  ],
  [
    'Understanding Kingdom giving',
    'Stewardship, generosity, and faith principles for Kingdom advancement.',
    'gift',
  ],
  [
    'Church Administration and Management',
    'Systems, teams, and governance that support healthy ministry operations.',
    'network',
  ],
  [
    'Principles of Kingdom Service',
    'Serving with humility, purpose, and excellence as a Kingdom steward.',
    'hands',
  ],
  [
    'Principles and Practices of Evangelism',
    'Practical tools and biblical foundations for winning and discipling souls.',
    'globe',
  ],
  [
    'The Power ministry',
    'Walking in faith for signs, wonders, and compassionate ministry to people.',
    'bolt',
  ],
  [
    'The preacher and his preaching',
    'Preparing messages, preaching with clarity, and growing as a communicator.',
    'mic',
  ],
  [
    'Laws of Church Growth',
    'Principles that help ministries grow healthily and sustainably over time.',
    'chart',
  ],
];
const paths = {
  compass: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18', 'm16 8-2 6-6 2 2-6 6-2Z'],
  growth: ['M12 21V11', 'M12 15C4 15 3 9 3 6c6 0 9 3 9 9Z', 'M12 11c0-6 4-8 9-8 0 5-3 8-9 8Z'],
  shield: ['M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z', 'm8 12 3 3 5-6'],
  home: ['m3 11 9-8 9 8', 'M5 9v12h14V9', 'M10 21v-7h4v7'],
  book: ['M12 5v16', 'M12 5C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 1'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  spark: ['m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z', 'M20 2v4m-2-2h4'],
  tools: ['M8 3h8v4H8z', 'M8 5H4v16h16V5h-4', 'm8 13 2 2 5-5', 'M8 18h8'],
  message: ['M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z', 'M8 10h8m-8 4h5'],
  heart: [
    'M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  ],
  church: [
    'M3 21V11l4-2v12M21 21V11l-4-2v12',
    'M7 21V8l5-4 5 4v13Z',
    'M12 1v6m-3-3h6',
    'M10 21v-6h4v6',
  ],
  flame: ['M12 2c2 7 7 8 7 13a7 7 0 0 1-14 0c0-3 2-5 3-7 0 4 2 5 3 5 2-3 1-6 1-11Z'],
  steps: ['M3 21h5v-6h5V9h5V3h3', 'm15 3h6v6'],
  gift: [
    'M3 8h18v4H3z',
    'M5 12v9h14v-9',
    'M12 8v13',
    'M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z',
  ],
  network: ['M8 2h8v5H8z', 'M3 17h6v5H3z', 'M15 17h6v5h-6z', 'M12 7v5M6 17v-5h12v5'],
  hands: ['M2 12h4l4-5h5l3 3-4 4-4-3', 'm6 12 6 8 9-9', 'M2 9v10h4M22 7v10h-4'],
  globe: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    'M2 12h20',
    'M12 2c-5 6-5 14 0 20 5-6 5-14 0-20Z',
  ],
  bolt: ['m13 2-9 12h7l-1 8 10-13h-7l1-7Z'],
  mic: ['M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5Z', 'M5 10v2a7 7 0 0 0 14 0v-2', 'M12 19v3m-4 0h8'],
  chart: ['M3 3v18h18', 'm6 16 5-5 4 3 6-8', 'M16 6h5v5'],
};
export function CurriculumSection() {
  return (
    <section
      id="curriculum"
      className="site-section curriculum-section"
      aria-labelledby="curriculum-title"
    >
      <div className="curriculum-heading">
        <div>
          <p className="eyebrow">Curriculum</p>
          <h2 id="curriculum-title">
            Modules that equip you
            <br />
            to <em>lead and serve.</em>
          </h2>
          <p className="curriculum-intro">
            A practical leadership and ministry curriculum designed to develop skills, character,
            and spiritual strength.
          </p>
        </div>
        <span className="curriculum-count">
          <strong>20</strong> ministry &amp; leadership modules
        </span>
      </div>
      <div className="curriculum-grid">
        {modules.map(([title, copy, icon], i) => (
          <article className="curriculum-card" key={title}>
            <div className="curriculum-card-top">
              <span className="curriculum-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {paths[icon as keyof typeof paths].map((d, n) => (
                    <path key={n} d={d} />
                  ))}
                </svg>
              </span>
              <span className="curriculum-number">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
