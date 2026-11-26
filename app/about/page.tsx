import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/site/public-header';
export const metadata: Metadata = {
  title: 'About HOSOM',
  description:
    'Learn about Hope School of Ministry and its approach to theological study, formation, and practical leadership.',
};
export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main className="about-content">
        <p className="eyebrow">About HOSOM</p>
        <h1>
          Learning shaped for <em>faithful service.</em>
        </h1>
        <div className="about-columns">
          <p>
            Hope School of Ministry supports students in theological study, spiritual formation and
            practical leadership. HELMS gives each member of the community a role-appropriate
            learning and academic workspace.
          </p>
          <div>
            <section>
              <h2>Mission</h2>
              <p>To equip ministry leaders for thoughtful and effective service.</p>
            </section>
            <section>
              <h2>Learning model</h2>
              <p>Flexible online learning, scheduled interaction and locally grounded support.</p>
            </section>
            <section>
              <h2>Our community</h2>
              <p>
                Students, lecturers and school teams work together from application through
                learning, assessment and graduation.
              </p>
            </section>
          </div>
        </div>
        <section className="about-callout">
          <div>
            <p className="eyebrow">Admissions</p>
            <h2>Ready to take the next step?</h2>
            <p>Explore a programme that suits your calling and begin your application.</p>
          </div>
          <Link className="button" href="/admissions">
            Start an application →
          </Link>
        </section>
        <section className="about-contact">
          <div>
            <h2>Contact HOSOM</h2>
            <p>Contact HOSOM for admissions, programme information and student support.</p>
          </div>
          <div>
            <a href="mailto:hopeschool@piccworldwide.org">hopeschool@piccworldwide.org</a>
            <a href="tel:+265999045869">+265 999 045 869</a>
            <span>Lilongwe, Malawi</span>
          </div>
        </section>
      </main>
    </>
  );
}
