'use client';
import { useMemo, useState } from 'react';
import type { RoleSlug } from '@/lib/demo-data';
import { roles } from '@/lib/demo-data';
import { managementSpec, type ContentRow } from '@/lib/management-fixtures';
import { useWorkflows } from '@/components/providers/workflow-provider';

function StatusTag({ value }: { value: string }) {
  const positive =
    /^(Active|Available|Approved|Published|Confirmed|Verified|Recorded|Defined|Current|Enrolled)$/i.test(
      value,
    );
  return <span className={`mc-status${positive ? ' mc-status-good' : ''}`}>{value}</span>;
}
function RecordDetails({ row, close }: { row: ContentRow; close: () => void }) {
  const label = Object.values(row)[1] || Object.values(row)[0] || 'Record';
  return (
    <div
      className="mc-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        className="mc-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${label} details`}
      >
        <button className="mc-dialog-close" aria-label="Close details" onClick={close}>
          ×
        </button>
        <p className="eyebrow">RECORD DETAILS · SAMPLE DATA</p>
        <h2>{label}</h2>
        <dl>
          {Object.entries(row).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>
                {key === 'Status' || key === 'Outcome' ? <StatusTag value={value} /> : value || '—'}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mc-detail-note">
          This is an illustrative record from the HOSOM interface. Live details will come from the
          separate backend.
        </p>
        <button className="mc-secondary" onClick={close}>
          Close details
        </button>
      </section>
    </div>
  );
}
export function ManagementContent({ role, section }: { role: RoleSlug; section: string }) {
  const { state } = useWorkflows();
  const spec = useMemo(() => managementSpec(role, section, state), [role, section, state]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState<ContentRow | null>(null);
  const statusColumn = spec.columns.find((column) => ['Status', 'Outcome'].includes(column));
  const statuses = statusColumn
    ? ['All', ...new Set(spec.rows.map((item) => item[statusColumn]).filter(Boolean))]
    : ['All'];
  const visible = spec.rows.filter(
    (item) =>
      (status === 'All' || item[statusColumn || 'Status'] === status) &&
      Object.values(item).join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className={`management-content mc-${spec.variant ?? 'register'}`}>
      <div className="mc-heading">
        <div>
          <p className="eyebrow">
            {spec.kicker} · {roles[role].label}
          </p>
          <h1>{spec.title}</h1>
          <p>{spec.description}</p>
        </div>
        <div className="mc-heading-symbol" aria-hidden="true">
          {section.slice(0, 1)}
        </div>
      </div>
      <section className="mc-summary" aria-label={`${spec.title} summary`}>
        {spec.stats.map((item) => (
          <article className="mc-metric" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </article>
        ))}
      </section>
      {spec.cards.length > 0 && (
        <section className="mc-card-grid" aria-label={`${spec.title} highlights`}>
          {spec.cards.map((item, index) => (
            <article className="mc-feature" key={item.title}>
              <div className="mc-feature-icon">{['◇', '▤', '◉'][index % 3]}</div>
              {item.meta && <small>{item.meta}</small>}
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>
      )}
      <section className="mc-register">
        <div className="mc-register-heading">
          <div>
            <p className="eyebrow">REGISTER</p>
            <h2>{spec.tableTitle}</h2>
            <span>
              {visible.length} of {spec.rows.length} sample records
            </span>
          </div>
          <div className="mc-filters">
            <label>
              <span className="sr-only">Search {spec.tableTitle.toLowerCase()}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this section…"
              />
            </label>
            {statusColumn && (
              <label>
                <span className="sr-only">Filter by {statusColumn.toLowerCase()}</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => (
                    <option value={item} key={item}>
                      {item === 'All' ? `All ${statusColumn.toLowerCase()}es` : item}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
        {spec.rows.length > 0 ? (
          <div className="mc-table-scroll">
            <table>
              <thead>
                <tr>
                  {spec.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length ? (
                  visible.map((item, index) => (
                    <tr key={`${Object.values(item)[0]}-${index}`}>
                      {spec.columns.map((column, columnIndex) => (
                        <td key={column}>
                          {column === statusColumn ? (
                            <StatusTag value={item[column]} />
                          ) : columnIndex === 1 ? (
                            <strong>{item[column]}</strong>
                          ) : (
                            item[column]
                          )}
                        </td>
                      ))}
                      <td>
                        <button className="mc-row-action" onClick={() => setSelected(item)}>
                          View details →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={spec.columns.length + 1} className="mc-empty">
                      No records match your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mc-empty">No sample records are available in this section.</div>
        )}
      </section>
      <p className="mc-prototype-note">
        {spec.note ??
          'HOSOM interface preview · Sample content only. This page does not persist changes or read from the backend.'}
      </p>
      {selected && <RecordDetails row={selected} close={() => setSelected(null)} />}
    </div>
  );
}
