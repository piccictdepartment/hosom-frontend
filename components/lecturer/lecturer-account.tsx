'use client';

import { useState, type FormEvent } from 'react';
import { AccountSecurity } from '@/components/portal/account-content';
import {
  LecturerDialog,
  LecturerHero,
  LecturerNote,
  LecturerStats,
  LecturerTable,
} from './lecturer-pages';

type Organisation = {
  id: string;
  name: string;
  email: string;
  contact: string;
  phone: string;
  address: string;
  notes: string;
};
type Mail = {
  id: string;
  subject: string;
  body: string;
  recipients: Organisation[];
  cc: string;
  bcc: string;
  attachments: string[];
  date: string;
};
const initialOrganisations: Organisation[] = [
  {
    id: 'ORG-1',
    name: 'Grace Community Foundation',
    email: 'partnerships@grace-foundation.example',
    contact: 'Martha Banda',
    phone: '+265 888 000 101',
    address: 'Lilongwe, Malawi',
    notes: '',
  },
  {
    id: 'ORG-2',
    name: 'Hope Education Network',
    email: 'office@hope-education.example',
    contact: 'David Tembo',
    phone: '+265 888 000 102',
    address: 'Blantyre, Malawi',
    notes: '',
  },
  {
    id: 'ORG-3',
    name: 'Unity Ministry Partners',
    email: 'contact@unity-ministry.example',
    contact: 'Sarah Phiri',
    phone: '+265 888 000 103',
    address: 'Mzuzu, Malawi',
    notes: '',
  },
];
const initialMail: Mail[] = [
  {
    id: 'MAIL-1',
    subject: 'Exploring academic collaboration',
    body: 'We would welcome a conversation about shared training opportunities and learning resources.',
    recipients: [initialOrganisations[1], initialOrganisations[2]],
    cc: '',
    bcc: '',
    attachments: [],
    date: '23 Oct 2026',
  },
];
export function LecturerMailer() {
  const [organisations, setOrganisations] = useState(initialOrganisations);
  const [messages, setMessages] = useState(initialMail);
  const [selected, setSelected] = useState<string[]>([]);
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [mailQuery, setMailQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [organisationModal, setOrganisationModal] = useState<Organisation | 'new' | null>(null);
  const [mailModal, setMailModal] = useState<Mail | null>(null);
  const [notice, setNotice] = useState('');
  const filteredOrganisations = organisations.filter((item) =>
    `${item.name} ${item.email} ${item.contact}`
      .toLowerCase()
      .includes(directoryQuery.toLowerCase()),
  );
  const filteredMail = messages.filter((item) =>
    `${item.subject} ${item.body} ${item.recipients.map((recipient) => recipient.name).join(' ')}`
      .toLowerCase()
      .includes(mailQuery.toLowerCase()),
  );
  function saveOrganisation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Organisation = {
      id:
        organisationModal !== 'new' && organisationModal
          ? organisationModal.id
          : `ORG-${Date.now()}`,
      name: String(form.get('name')),
      email: String(form.get('email')),
      contact: String(form.get('contact')),
      phone: String(form.get('phone')),
      address: String(form.get('address')),
      notes: String(form.get('notes')),
    };
    setOrganisations([item, ...organisations.filter((row) => row.id !== item.id)]);
    setOrganisationModal(null);
  }
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) return;
    const item: Mail = {
      id: `MAIL-${Date.now()}`,
      subject,
      body,
      recipients: organisations.filter((row) => selected.includes(row.id)),
      cc,
      bcc,
      attachments: files,
      date: 'This open view',
    };
    setMessages([item, ...messages]);
    setSelected([]);
    setSubject('');
    setBody('');
    setCc('');
    setBcc('');
    setFiles([]);
    setNotice('Demo email recorded. No external email was delivered.');
  }
  return (
    <div className="lp-page lp-mailer">
      <h1>Mailer</h1>
      <section className="lp-panel lp-mail-intro">
        <div className="lp-panel-heading">
          <div>
            <span className="lp-kicker">EXTERNAL COMMUNICATIONS</span>
            <h2>Mailer</h2>
            <p>Keep your partner contacts and outgoing correspondence in one place.</p>
          </div>
          <button
            className="lp-outline"
            onClick={() =>
              document.getElementById('lp-organisations')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Manage organisations
          </button>
        </div>
        <div className="lp-mail-stats">
          <span>
            <b>{organisations.length}</b> Organisations
          </span>
          <span>
            <b>{messages.length}</b> Emails recorded
          </span>
          <span>
            <b>{messages.filter((row) => row.date === 'This open view').length}</b> Sent by your
            office
          </span>
        </div>
        <p className="lp-muted">UI preview · Sending is simulated.</p>
      </section>
      {notice && (
        <p className="lp-success" role="status">
          {notice}
        </p>
      )}
      <div className="lp-mail-grid">
        <section className="lp-panel" id="lp-organisations">
          <div className="lp-panel-heading">
            <div>
              <h2>Organisations</h2>
              <p>Select one or more recipients to draft a message.</p>
            </div>
            <button className="lp-outline" onClick={() => setOrganisationModal('new')}>
              + Add organisation
            </button>
          </div>
          <div className="lp-mail-inner">
            <label className="lp-search-label">
              Search organisations
              <input
                type="search"
                value={directoryQuery}
                onChange={(event) => setDirectoryQuery(event.target.value)}
                placeholder="Name, email or contact…"
              />
            </label>
            <p className="lp-muted">{selected.length} selected</p>
            {filteredOrganisations.map((item) => (
              <article className="lp-org-row" key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? [...selected, item.id]
                          : selected.filter((id) => id !== item.id),
                      )
                    }
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.email}</small>
                    <small>{item.contact}</small>
                  </span>
                </label>
                <button className="lp-link" onClick={() => setOrganisationModal(item)}>
                  View / Edit
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="lp-panel">
          <div className="lp-panel-heading">
            <div>
              <h2>Compose email</h2>
              <p>Choose organisations from your directory and write your message.</p>
            </div>
            <span className="lp-pill">From: Lecturer</span>
          </div>
          <form className="lp-form lp-mail-inner" onSubmit={send}>
            <div className="lp-selected">
              <strong>To · {selected.length} selected</strong>
              <p>
                {selected.length
                  ? organisations
                      .filter((row) => selected.includes(row.id))
                      .map((row) => row.name)
                      .join(', ')
                  : 'Select an organisation on the left to start.'}
              </p>
            </div>
            <div className="lp-form-grid">
              <label>
                CC
                <input
                  value={cc}
                  onChange={(event) => setCc(event.target.value)}
                  placeholder="Email addresses, separated by commas"
                />
              </label>
              <label>
                BCC
                <input
                  value={bcc}
                  onChange={(event) => setBcc(event.target.value)}
                  placeholder="Email addresses, separated by commas"
                />
              </label>
            </div>
            <label>
              Subject
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="What is this email about?"
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows={7}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your message…"
              />
            </label>
            <label>
              Attach files
              <input
                type="file"
                multiple
                onChange={(event) =>
                  setFiles(Array.from(event.target.files || []).map((file) => file.name))
                }
              />
            </label>
            <p className="lp-muted">
              {files.length ? files.join(', ') : 'File names are shown in this preview.'}
            </p>
            <div className="lp-actions">
              <button className="lp-primary" type="submit" disabled={!selected.length}>
                Send email (demo) ↗
              </button>
            </div>
          </form>
        </section>
      </div>
      <section className="lp-panel">
        <div className="lp-panel-heading">
          <h2>Sent activity</h2>
          <input
            type="search"
            aria-label="Search sent emails"
            placeholder="Subject, organisation or sender…"
            value={mailQuery}
            onChange={(event) => setMailQuery(event.target.value)}
          />
        </div>
        <div className="lp-message-list lp-mail-inner">
          {filteredMail.map((item) => (
            <button key={item.id} onClick={() => setMailModal(item)}>
              <span className="lp-message-icon">✉</span>
              <span>
                <strong>{item.subject}</strong>
                <span>To: {item.recipients.map((recipient) => recipient.name).join(', ')}</span>
                <small>{item.date}</small>
              </span>
              <em>View email →</em>
            </button>
          ))}
          {!filteredMail.length && <p className="lp-empty">No sent emails yet.</p>}
        </div>
      </section>
      {organisationModal && (
        <LecturerDialog
          label={organisationModal === 'new' ? 'Add organisation' : 'Organisation details'}
          onClose={() => setOrganisationModal(null)}
        >
          <span className="lp-kicker">ORGANISATION DIRECTORY</span>
          <h2>{organisationModal === 'new' ? 'Add organisation' : organisationModal.name}</h2>
          <form className="lp-form" onSubmit={saveOrganisation}>
            <label>
              Organisation name
              <input
                name="name"
                required
                defaultValue={organisationModal === 'new' ? '' : organisationModal.name}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                defaultValue={organisationModal === 'new' ? '' : organisationModal.email}
              />
            </label>
            <div className="lp-form-grid">
              <label>
                Contact person
                <input
                  name="contact"
                  defaultValue={organisationModal === 'new' ? '' : organisationModal.contact}
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  defaultValue={organisationModal === 'new' ? '' : organisationModal.phone}
                />
              </label>
            </div>
            <label>
              Address
              <input
                name="address"
                defaultValue={organisationModal === 'new' ? '' : organisationModal.address}
              />
            </label>
            <label>
              Notes
              <textarea
                name="notes"
                rows={3}
                defaultValue={organisationModal === 'new' ? '' : organisationModal.notes}
              />
            </label>
            <div className="lp-actions">
              <button
                className="lp-outline"
                type="button"
                onClick={() => setOrganisationModal(null)}
              >
                Cancel
              </button>
              <button className="lp-primary" type="submit">
                {organisationModal === 'new' ? 'Add organisation' : 'Save changes'}
              </button>
            </div>
          </form>
        </LecturerDialog>
      )}
      {mailModal && (
        <LecturerDialog label="Sent email" onClose={() => setMailModal(null)}>
          <span className="lp-kicker">SENT EMAIL · EXTERNAL ORGANISATIONS</span>
          <h2>{mailModal.subject}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>From</dt>
              <dd>Lecturer</dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>{mailModal.recipients.map((row) => row.email).join('; ')}</dd>
            </div>
            <div>
              <dt>Sent</dt>
              <dd>{mailModal.date}</dd>
            </div>
            <div>
              <dt>CC</dt>
              <dd>{mailModal.cc || '—'}</dd>
            </div>
            <div>
              <dt>BCC</dt>
              <dd>{mailModal.bcc || '—'}</dd>
            </div>
          </dl>
          <p>{mailModal.body}</p>
          <h3>Attachments ({mailModal.attachments.length})</h3>
          <p>{mailModal.attachments.join(', ') || 'No attachments included.'}</p>
          <button className="lp-outline" onClick={() => setMailModal(null)}>
            Close email
          </button>
        </LecturerDialog>
      )}
    </div>
  );
}

export function LecturerAccountSecurity() {
  return <AccountSecurity role="lecturer" />;
}

type Preference = { title: string; channel: string; events: string; status: string };
export function LecturerPreferences() {
  const [rows, setRows] = useState<Preference[]>([
    {
      title: 'Assessment reminders',
      channel: 'In-app',
      events: 'Upcoming assignment and exam deadlines',
      status: 'Available',
    },
  ]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<Preference | null>(null);
  const [creating, setCreating] = useState(false);
  const visible = rows.filter(
    (row) =>
      `${row.title} ${row.channel} ${row.events}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'All' || row.status === filter),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRows([
      {
        title: String(form.get('title')),
        channel: String(form.get('channel')),
        events: String(form.get('events')),
        status: 'Private draft',
      },
      ...rows,
    ]);
    setCreating(false);
  }
  return (
    <div className="lp-page">
      <h1>Notification Preferences</h1>
      <LecturerHero
        eyebrow="LECTURER"
        title="Notification preferences"
        copy="Prepare preferences for future communication services."
        action={
          <button className="lp-primary" onClick={() => setCreating(true)}>
            Prepare draft
          </button>
        }
      />
      <LecturerStats
        items={[
          ['Available records', rows.length],
          ['Private drafts', rows.filter((row) => row.status === 'Private draft').length],
          ['Unread records', 0],
        ]}
      />
      <div className="lp-filters">
        <input
          type="search"
          aria-label="Search notification preferences"
          placeholder="Search notification preferences"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Record filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          {['All', 'Available', 'Private draft'].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <section className="lp-panel">
        <LecturerTable headings={['Title / record', 'Channel', 'Events', 'Status', 'Action']}>
          {visible.map((row, index) => (
            <tr key={`${row.title}-${index}`}>
              <td>
                <strong>{row.title}</strong>
              </td>
              <td>{row.channel}</td>
              <td>{row.events}</td>
              <td>
                <span className="lp-pill">{row.status}</span>
              </td>
              <td>
                <button className="lp-link" onClick={() => setActive(row)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </LecturerTable>
      </section>
      <LecturerNote title="Workspace status">
        Prepared preferences are shown in this UI preview.
      </LecturerNote>
      {active && (
        <LecturerDialog label="Preference details" onClose={() => setActive(null)}>
          <h2>{active.title}</h2>
          <dl className="lp-detail-grid">
            <div>
              <dt>Channel</dt>
              <dd>{active.channel}</dd>
            </div>
            <div>
              <dt>Events</dt>
              <dd>{active.events}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{active.status}</dd>
            </div>
          </dl>
        </LecturerDialog>
      )}
      {creating && (
        <LecturerDialog label="New preference" onClose={() => setCreating(false)}>
          <h2>New draft</h2>
          <form className="lp-form" onSubmit={save}>
            <label>
              Preference name
              <input name="title" required />
            </label>
            <label>
              Channel
              <select name="channel">
                {['In-app', 'Email', 'SMS', 'Push', 'WhatsApp / approved messaging API'].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Events
              <textarea name="events" rows={4} required />
            </label>
            <label>
              Preference
              <select>
                <option>Enabled when service is connected</option>
                <option>Disabled</option>
              </select>
            </label>
            <label>
              Contact confirmation / notes
              <textarea rows={3} />
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
