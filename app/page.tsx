import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PublicHeader } from '@/components/site/public-header';
import { Brand } from '@/components/site/brand';
import { programmes } from '@/lib/demo-data';
import { CurriculumSection } from '@/components/site/curriculum';
export default function Home() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">HOSOM E-Learning and Academic Management System</p>
            <h1>
              Grow in calling.
              <br />
              <em>Learn with purpose.</em>
            </h1>
            <p className="hero-lede">
              Ministry-centred learning that brings together academic excellence, flexible access
              and a connected HOSOM community.
            </p>
            <div className="hero-actions">
              <Link className={cn(buttonVariants({ size: 'lg' }), 'h-12 px-5')} href="/admissions">
                Start an application <span>→</span>
              </Link>
              <Link className="text-action" href="/programmes">
                Explore programmes <span>↓</span>
              </Link>
            </div>
            <div className="hero-stats">
              <span>
                <b>100%</b> online-ready learning
              </span>
              <span>
                <b>10</b> role-specific workspaces
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="orbit" />
            <div className="hero-card">
              <span>✦</span>
              <p>
                Equipping leaders
                <br />
                for service.
              </p>
              <hr />
              <small>HOSOM · EST. 2026</small>
            </div>
            <div className="hero-note">
              <b>Learning that travels with you</b>
              <span>Study, connect and progress wherever you are.</span>
            </div>
          </div>
        </section>
        <div className="trust-strip">
          <span>FAITH-CENTRED</span>
          <i />
          <span>FLEXIBLE LEARNING</span>
          <i />
          <span>ACADEMIC EXCELLENCE</span>
          <i />
          <span>COMMUNITY</span>
        </div>
        <section className="site-section intro-section" id="about">
          <div>
            <p className="eyebrow">Welcome to HOSOM</p>
            <h2>
              Education that serves
              <br />
              <em>the whole calling.</em>
            </h2>
          </div>
          <div>
            <p>
              Hope School of Ministry prepares students for thoughtful, effective ministry through
              accessible learning, experienced mentorship and practical formation.
            </p>
            <Link className="under-link" href="/about">
              Learn about HOSOM →
            </Link>
          </div>
        </section>
        <section className="site-section programme-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Academic pathways</p>
              <h2>
                Find your <em>next step.</em>
              </h2>
            </div>
            <Link className="outline-button" href="/programmes">
              View all programmes →
            </Link>
          </div>
          <div className="programme-grid">
            {programmes.map((p, i) => (
              <article className="programme-card" key={p.code}>
                <span className="programme-icon">{['✦', '◇', '◉'][i]}</span>
                <p className="eyebrow">{p.type}</p>
                <h3>{p.name}</h3>
                <p>{p.duration} · Blended and online study pathways</p>
                <div className="card-footer">
                  <span>{p.status}</span>
                  <Link href="/programmes">Explore →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CurriculumSection />
        <section className="admissions-band">
          <div>
            <p className="eyebrow">Admissions at HOSOM</p>
            <h2>
              Your journey
              <br />
              starts <em>here.</em>
            </h2>
            <p>
              Our guided application journey keeps you informed from submission to admission and
              enrolment.
            </p>
            <Link
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 bg-[var(--navy2)] px-5 text-white hover:bg-[var(--navy)]',
              )}
              href="/admissions"
            >
              Apply to HOSOM →
            </Link>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <b>Choose a programme</b>
                <p>Explore academic pathways that align with your calling.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <b>Submit your application</b>
                <p>Provide your details and supporting documents.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <b>Track your progress</b>
                <p>Stay informed as your application is reviewed.</p>
              </div>
            </li>
          </ol>
        </section>
        <section className="site-section experience-section" id="experience">
          <div className="experience-art">
            <span>H</span>
            <blockquote>
              “Education is not preparation for service. It is part of service.”
            </blockquote>
          </div>
          <div>
            <p className="eyebrow">A connected learning experience</p>
            <h2>
              Everything you need,
              <br />
              <em>in one place.</em>
            </h2>
            <p>
              HELMS brings learning resources, assignment feedback, results, fees, timetables and
              announcements within reach on desktop, tablet or mobile.
            </p>
            <Link className="under-link" href="/portal/student/overview">
              Explore the student portal →
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer" id="contact">
        <div>
          <Brand light />
          <p>Equipping leaders for faithful service.</p>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/about">About HOSOM</Link>
          <Link href="/programmes">Programmes</Link>
          <Link href="/admissions">Admissions</Link>
          <Link href="/login">Portal preview</Link>
        </div>
        <div>
          <b>Contact</b>
          <a href="mailto:hopeschool@piccworldwide.org">hopeschool@piccworldwide.org</a>
          <a href="mailto:info@piccworldwide.org">info@piccworldwide.org</a>
          <a href="tel:+265999045869">+265 999 045 869</a>
          <a href="tel:+265992603608">+265 992 603 608</a>
          <span>Lilongwe, Malawi</span>
        </div>
        <small className="copyright">© 2026 Hope School of Ministry. All rights reserved.</small>
      </footer>
    </>
  );
}
