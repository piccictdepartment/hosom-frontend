'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { programmes } from '@/lib/demo-data';
import { useWorkflows } from '@/components/providers/workflow-provider';

type Application = {
  intake: string;
  programme: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  maritalStatus: string;
  phone: string;
  email: string;
  qualification: string;
  residentialAddress: string;
  permanentAddress: string;
  village: string;
  traditionalAuthority: string;
  district: string;
  country: string;
  piccStatus: string;
  serviceGroup: string;
  denomination: string;
  learningMode: string;
};
const initialApplication: Application = {
  intake: 'Cohort 1',
  programme: programmes[0].name,
  firstName: '',
  lastName: '',
  gender: '',
  age: '',
  maritalStatus: '',
  phone: '',
  email: '',
  qualification: '',
  residentialAddress: '',
  permanentAddress: '',
  village: '',
  traditionalAuthority: '',
  district: '',
  country: 'Malawi',
  piccStatus: '',
  serviceGroup: '',
  denomination: '',
  learningMode: '',
};
const labels = ['Programme', 'Personal details', 'Address & church', 'Review'];
const dateRows = [
  ['Registration opens', 'Dates to be announced'],
  ['Registration deadline', 'Dates to be announced'],
  ['Cohort 1 starts', 'Dates to be announced'],
  ['Cohort 1 ends', 'Dates to be announced'],
  ['Cohort 2 registration', 'Dates to be announced'],
];
export function ApplicationFlow() {
  const { dispatch } = useWorkflows();
  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<Application>(initialApplication);
  const [nationalIdName, setNationalIdName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  function update<K extends keyof Application>(key: K, value: Application[K]) {
    setApplication((previous) => ({ ...previous, [key]: value }));
  }
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    if (!confirmed) return;
    dispatch({
      type: 'candidate/add',
      name: `${application.firstName.trim()} ${application.lastName.trim()}`,
      programme: application.programme,
      details: { ...application, nationalIdName },
    });
    setSubmitted(true);
  }
  return (
    <main className="application-page">
      <div className="application-wrap">
        <aside className="application-intro">
          <p className="eyebrow">Admissions</p>
          <h1>
            Begin your
            <br />
            <em>HOSOM journey.</em>
          </h1>
          <p>Complete the application form with your personal, academic and church information.</p>
          <div className="application-stepper" aria-label="Application steps">
            {labels.map((name, index) => (
              <span className={step >= index + 1 ? 'active' : ''} key={name}>
                <i>{index + 1}</i>
                {name}
              </span>
            ))}
          </div>
          <section className="application-dates">
            <p className="eyebrow">Important dates</p>
            {dateRows.map(([label, date]) => (
              <div key={label}>
                <span>{label}</span>
                <b>{date}</b>
              </div>
            ))}
          </section>
          <section className="registration-process">
            <h2>Registration process</h2>
            <p>Complete the steps below to begin your application journey.</p>
            <ol>
              <li>Complete the online registration form.</li>
              <li>Receive a confirmation and registration ID when the backend is connected.</li>
              <li>Attend orientation on the relevant start date.</li>
              <li>Join the HOSOM community of learners.</li>
            </ol>
          </section>
        </aside>
        {submitted ? (
          <section
            className="application-card application-success"
            role="status"
            aria-live="polite"
          >
            <span className="success-icon" aria-hidden="true">
              ✓
            </span>
            <h2>Sample application submitted</h2>
            <p>
              {application.firstName} {application.lastName} has been added to the Secretariat
              review queue in this browser tab.
            </p>
            <p className="application-small">
              This is a demo. No email was sent, no document was uploaded, and the application
              resets when the page is refreshed.
            </p>
            <div className="application-actions">
              <Link className="button" href="/portal/secretariat/applications">
                View review queue →
              </Link>
              <Link className="outline-button" href="/">
                Return home
              </Link>
            </div>
          </section>
        ) : (
          <form className="application-card" onSubmit={advance}>
            {step === 1 && (
              <>
                <p className="eyebrow">Step 1 of 4</p>
                <h2>Programme and intake</h2>
                <label>
                  Intake / cohort
                  <select
                    value={application.intake}
                    onChange={(event) => update('intake', event.target.value)}
                    required
                  >
                    <option>Cohort 1</option>
                    <option>Cohort 2</option>
                  </select>
                </label>
                <label>
                  Programme
                  <select
                    value={application.programme}
                    onChange={(event) => update('programme', event.target.value)}
                    required
                  >
                    {programmes.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="button application-full" type="submit">
                  Continue →
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <p className="eyebrow">Step 2 of 4</p>
                <h2>Personal details</h2>
                <div className="application-fields">
                  <label>
                    First name *
                    <input
                      required
                      value={application.firstName}
                      onChange={(event) => update('firstName', event.target.value)}
                      placeholder="First name"
                    />
                  </label>
                  <label>
                    Last name *
                    <input
                      required
                      value={application.lastName}
                      onChange={(event) => update('lastName', event.target.value)}
                      placeholder="Last name"
                    />
                  </label>
                </div>
                <div className="application-fields three">
                  <label>
                    Gender *
                    <select
                      required
                      value={application.gender}
                      onChange={(event) => update('gender', event.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Prefer not to say</option>
                    </select>
                  </label>
                  <label>
                    Age *
                    <input
                      type="number"
                      min="16"
                      max="120"
                      required
                      value={application.age}
                      onChange={(event) => update('age', event.target.value)}
                      placeholder="Age"
                    />
                  </label>
                  <label>
                    Marital status *
                    <select
                      required
                      value={application.maritalStatus}
                      onChange={(event) => update('maritalStatus', event.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Widowed</option>
                      <option>Divorced</option>
                    </select>
                  </label>
                </div>
                <div className="application-fields">
                  <label>
                    Phone / mobile *
                    <input
                      type="tel"
                      required
                      value={application.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      placeholder="+265 700 000 000"
                    />
                  </label>
                  <label>
                    Email *
                    <input
                      type="email"
                      required
                      value={application.email}
                      onChange={(event) => update('email', event.target.value)}
                      placeholder="email@address.com"
                    />
                  </label>
                </div>
                <label>
                  Highest completed qualification
                  <select
                    value={application.qualification}
                    onChange={(event) => update('qualification', event.target.value)}
                  >
                    <option value="">Select qualification</option>
                    <option>Malawi School Certificate of Education</option>
                    <option>Diploma</option>
                    <option>Undergraduate degree</option>
                    <option>Postgraduate degree</option>
                  </select>
                </label>
                <div className="application-actions">
                  <button className="outline-button" type="button" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="button" type="submit">
                    Continue →
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <p className="eyebrow">Step 3 of 4</p>
                <h2>Address and church details</h2>
                <p className="application-field-heading">Address information</p>
                <label>
                  Residential address *
                  <input
                    required
                    value={application.residentialAddress}
                    onChange={(event) => update('residentialAddress', event.target.value)}
                    placeholder="Current neighbourhood / area"
                  />
                </label>
                <label>
                  Permanent home address *
                  <input
                    required
                    value={application.permanentAddress}
                    onChange={(event) => update('permanentAddress', event.target.value)}
                    placeholder="Home village address"
                  />
                </label>
                <div className="application-fields">
                  <label>
                    Village *
                    <input
                      required
                      value={application.village}
                      onChange={(event) => update('village', event.target.value)}
                      placeholder="Village name"
                    />
                  </label>
                  <label>
                    T/A *
                    <input
                      required
                      value={application.traditionalAuthority}
                      onChange={(event) => update('traditionalAuthority', event.target.value)}
                      placeholder="Traditional Authority"
                    />
                  </label>
                </div>
                <div className="application-fields">
                  <label>
                    District *
                    <input
                      required
                      value={application.district}
                      onChange={(event) => update('district', event.target.value)}
                      placeholder="District"
                    />
                  </label>
                  <label>
                    Country *
                    <input
                      required
                      value={application.country}
                      onChange={(event) => update('country', event.target.value)}
                    />
                  </label>
                </div>
                <p className="application-field-heading">Church and learning</p>
                <div className="application-fields">
                  <label>
                    PICC status *
                    <select
                      required
                      value={application.piccStatus}
                      onChange={(event) => update('piccStatus', event.target.value)}
                    >
                      <option value="">Select status</option>
                      <option>Member</option>
                      <option>Regular attendee</option>
                      <option>New attendee</option>
                      <option>Not a PICC attendee</option>
                    </select>
                  </label>
                  <label>
                    PICC service group
                    <input
                      value={application.serviceGroup}
                      onChange={(event) => update('serviceGroup', event.target.value)}
                      placeholder="e.g. Ushering, Choir"
                    />
                  </label>
                </div>
                <label>
                  Church denomination *
                  <input
                    required
                    value={application.denomination}
                    onChange={(event) => update('denomination', event.target.value)}
                    placeholder="Your church denomination"
                  />
                </label>
                <label>
                  Preferred mode of learning *
                  <select
                    required
                    value={application.learningMode}
                    onChange={(event) => update('learningMode', event.target.value)}
                  >
                    <option value="">Select mode of learning</option>
                    <option>Online with scheduled sessions</option>
                    <option>Blended learning</option>
                    <option>In-person learning</option>
                  </select>
                </label>
                <p className="application-field-heading">Identity document</p>
                <label>
                  National ID document *
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!nationalIdName}
                    onChange={(event) => setNationalIdName(event.target.files?.[0]?.name ?? '')}
                  />
                  <small>
                    {nationalIdName
                      ? `Selected: ${nationalIdName}`
                      : 'Select a PDF, JPG or PNG file for this demo. The file is not uploaded or saved.'}
                  </small>
                </label>
                <div className="application-actions">
                  <button className="outline-button" type="button" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button className="button" type="submit">
                    Continue →
                  </button>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <p className="eyebrow">Step 4 of 4</p>
                <h2>Review your application</h2>
                <div className="application-review">
                  <strong>{application.programme}</strong>
                  <span>{application.intake}</span>
                  <span>
                    Applicant: {application.firstName} {application.lastName}
                  </span>
                  <span>Phone: {application.phone}</span>
                  <span>Email: {application.email}</span>
                  <span>
                    Address: {application.residentialAddress}, {application.district}
                  </span>
                  <span>Church: {application.denomination}</span>
                  <span>Learning mode: {application.learningMode}</span>
                  <span>National ID: {nationalIdName}</span>
                </div>
                <label className="application-confirm">
                  <input
                    type="checkbox"
                    required
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                  />{' '}
                  I confirm that the sample information is accurate and complete.
                </label>
                <div className="application-actions">
                  <button className="outline-button" type="button" onClick={() => setStep(3)}>
                    ← Back
                  </button>
                  <button className="button" type="submit">
                    Submit sample application
                  </button>
                </div>
                <p className="application-small">
                  The application will appear in the Secretariat queue until you refresh this tab.
                  No information is sent to a server.
                </p>
              </>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
