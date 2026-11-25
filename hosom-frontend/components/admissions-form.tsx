'use client';
import { useState, type FormEvent } from 'react';
import { programmes } from '@/lib/demo-data';
import { useWorkflows } from './workflow-provider';
export function AdmissionsForm() {
  const { dispatch } = useWorkflows();
  const [name, setName] = useState(''); const [programme, setProgramme] = useState<string>(programmes[0].name); const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); if (!name.trim()) return; dispatch({ type: 'candidate/add', name: name.trim(), programme }); setSubmitted(true); setName(''); }
  return <form className="admission-demo-form" onSubmit={submit}><p className="eyebrow">TRY THE PROCESS</p><h2>Sample application</h2><p>Submit a sample candidate, then open Secretariat → Applications to continue the workflow.</p><label className="flow-field">Applicant name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Enter a sample name" /></label><label className="flow-field">Programme<select value={programme} onChange={e => setProgramme(e.target.value)}>{programmes.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}</select></label><button className="flow-button" type="submit">Submit sample application</button>{submitted && <p className="flow-success" role="status">Application added to the Secretariat review queue. It will disappear on refresh.</p>}</form>;
}
