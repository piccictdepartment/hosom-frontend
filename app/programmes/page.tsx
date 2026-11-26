import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/site/public-header';
import { programmes } from '@/lib/demo-data';
export const metadata: Metadata = { title: 'Programmes' };
export default function ProgrammesPage() {
  return (
    <>
      <PublicHeader />
      <main className="public-inner">
        <div className="inner-hero">
          <p className="eyebrow">Academic pathways</p>
          <h1>
            Prepare for a life of <em>purpose.</em>
          </h1>
          <p>
            Explore HOSOM&apos;s ministry-centred courses and find a programme aligned with your
            calling.
          </p>
        </div>
        <div className="programme-grid full-grid">
          {programmes.map((p, i) => (
            <article className="programme-card" key={p.code}>
              <span className="programme-icon">{['✦', '◇', '◉'][i]}</span>
              <p className="eyebrow">
                {p.type} · {p.code}
              </p>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <div className="programme-facts">
                <span>Duration</span>
                <strong>{p.duration}</strong>
                <span>Study mode</span>
                <strong>Online & blended</strong>
              </div>
              <div className="card-footer">
                <span>{p.status}</span>
                <Link href="/admissions">Apply →</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="inner-cta">
          <h2>Ready to take the next step?</h2>
          <p>Begin your HOSOM application journey.</p>
          <Link className="button" href="/admissions">
            Explore admissions →
          </Link>
        </div>
      </main>
    </>
  );
}
