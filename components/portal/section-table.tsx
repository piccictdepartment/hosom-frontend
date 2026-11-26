'use client';

import { useMemo, useState } from 'react';
import type { DemoRow } from '@/lib/catalogue';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const positive = new Set(['Active', 'Confirmed', 'Open', 'Admitted', 'Selected', 'In progress', 'New']);

export function SectionTable({ columns, rows }: { columns: string[]; rows: DemoRow[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const statuses = ['All', ...new Set(rows.map(row => row.Status).filter(Boolean))];
  const visible = useMemo(
    () => rows.filter(row => (status === 'All' || row.Status === status) && Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase().trim())),
    [rows, query, status],
  );

  return (
    <section className="data-panel">
      <div className="table-controls">
        <div>
          <h2>Records</h2>
          <p>Illustrative records for this interface preview.</p>
        </div>
        <div className="table-inputs">
          <Label className="sr-only" htmlFor="record-search">Search records</Label>
          <Input id="record-search" type="search" placeholder="Search records…" value={query} onChange={event => setQuery(event.target.value)} />
          <Label className="sr-only" htmlFor="status-filter">Filter by status</Label>
          <select id="status-filter" value={status} onChange={event => setStatus(event.target.value)}>
            {statuses.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => <TableHead key={column}>{column}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length ? visible.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column}>
                  {column === 'Status'
                    ? <Badge variant={positive.has(row[column]) ? 'default' : 'secondary'}>{row[column]}</Badge>
                    : row[column]}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="empty-cell">No matching records. Try a different search or status.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-footer">Showing {visible.length} of {rows.length} demo records</div>
    </section>
  );
}
