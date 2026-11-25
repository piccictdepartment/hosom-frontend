'use client';
import { useMemo, useState } from 'react';
import type { DemoRow } from '@/lib/catalogue';
export function SectionTable({ columns, rows }: { columns: string[]; rows: DemoRow[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const statuses = ['All', ...new Set(rows.map(row => row.Status).filter(Boolean))];
  const visible = useMemo(() => rows.filter(row => (status === 'All' || row.Status === status) && Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase().trim())), [rows, query, status]);
  return <section className="data-panel"><div className="table-controls"><div><h2>Records</h2><p>Illustrative records for this interface preview.</p></div><div className="table-inputs"><label className="sr-only" htmlFor="record-search">Search records</label><input id="record-search" type="search" placeholder="Search records…" value={query} onChange={event => setQuery(event.target.value)} /><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" value={status} onChange={event => setStatus(event.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></div></div><div className="table-scroll"><table><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{visible.length ? visible.map((row, index) => <tr key={index}>{columns.map(column => <td key={column}>{column === 'Status' ? <span className={`status-pill ${['Active','Confirmed','Open','Admitted','Selected','In progress','New'].includes(row[column]) ? 'good' : ''}`}>{row[column]}</span> : row[column]}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty-cell">No matching records. Try a different search or status.</td></tr>}</tbody></table></div><div className="table-footer">Showing {visible.length} of {rows.length} demo records</div></section>;
}
