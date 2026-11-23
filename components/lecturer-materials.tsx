'use client';

import { useState, type FormEvent } from 'react';
import { lecturerTeachingCourses } from '@/lib/demo-data';
import { type CourseUnit, type Resource } from '@/lib/workflows';
import { useWorkflows } from './workflow-provider';
import { courseMaterials } from './learning-content';
import { StudentModal } from './student-modal';

type StudioResource = Resource & { description?: string; body?: string; unitId?: string; order?: number; fileName?: string };
const resourceTypes = ['Lesson', 'Course outline', 'Lecture notes', 'PDF document', 'Presentation', 'Video lecture', 'Recorded class', 'Audio resource', 'Reading material', 'Book', 'Online resource'];
const defaultUnits: CourseUnit[] = lecturerTeachingCourses.flatMap(course => [
  { id: `${course.code}-unit-1`, course: course.code, title: 'Unit 1 · Foundations', description: 'Build understanding through lessons and course readings.', order: 1 },
  { id: `${course.code}-unit-2`, course: course.code, title: 'Unit 2 · Practice and reflection', description: 'Apply your learning to ministry and leadership.', order: 2 },
]);
const staticIds = new Set(courseMaterials.map(resource => resource.id));
const legacyPreviewIds = new Set(['RS-101', 'RS-102', 'RS-103']);
const staticResources: StudioResource[] = courseMaterials.map((resource, index) => ({
  ...resource,
  status: 'Published',
  completed: false,
  body: resource.type === 'Lesson' ? `Welcome to ${resource.title.replace('Getting started with ', '')}.\n\nLearning objectives\n• Identify the main concepts in this course.\n• Connect the teaching to ministry practice.\n• Prepare questions for your next class.` : undefined,
  unitId: `${resource.course}-unit-${resource.type === 'Recorded class' ? 2 : 1}`,
  order: index + 1,
}));
const isVideo = (type: string) => ['Video lecture', 'Recorded class'].includes(type);
const isAudio = (type: string) => type === 'Audio resource';

export function LecturerMaterials() {
  const { state, dispatch } = useWorkflows();
  const [courseCode, setCourseCode] = useState(lecturerTeachingCourses[0].code);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [editing, setEditing] = useState<StudioResource | null>(null);
  const [addingUnit, setAddingUnit] = useState(false);
  const [preview, setPreview] = useState<StudioResource | null>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const [notice, setNotice] = useState('');
  const course = lecturerTeachingCourses.find(item => item.code === courseCode)!;
  const courseUnits = [...defaultUnits, ...state.courseUnits].filter(unit => unit.course === courseCode).sort((a, b) => a.order - b.order);
  const resources = [...staticResources.map(resource => ({ ...resource, ...state.resources.find(item => item.id === resource.id) })), ...state.resources.filter(resource => !staticIds.has(resource.id) && !legacyPreviewIds.has(resource.id))].filter(resource => resource.course === courseCode).sort((a, b) => (a.order || 0) - (b.order || 0));
  const visible = resources.filter(resource => (status === 'All' || resource.status === status) && `${resource.title} ${resource.type} ${resource.description || ''}`.toLowerCase().includes(query.toLowerCase()));
  const unitTitle = (resource: StudioResource) => courseUnits.find(unit => unit.id === resource.unitId)?.title || 'Course resource';

  function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') || '').trim();
    const link = String(data.get('url') || '').trim();
    if (!title) return;
    if (link && !link.startsWith('https://') && !link.startsWith('/demo/')) { setNotice('Use an HTTPS resource link.'); return; }
    if (upload && upload.size > 100 * 1024 * 1024) { setNotice('Choose a file smaller than 100 MB.'); return; }
    const resource: Resource = {
      id: editing?.id || `RS-LOCAL-${Date.now()}`,
      course: courseCode,
      title,
      type: String(data.get('type') || 'Lecture notes'),
      unitId: String(data.get('unitId') || courseUnits[0]?.id || ''),
      order: Number(data.get('order')) || resources.length + 1,
      description: String(data.get('description') || '').trim(),
      body: String(data.get('body') || '').trim(),
      url: upload ? URL.createObjectURL(upload) : link || editing?.url || '',
      fileName: upload?.name || editing?.fileName,
      allowDownload: data.get('allowDownload') === 'on',
      approvedExternal: data.get('approvedExternal') === 'on',
      status: 'Draft',
      completed: editing?.completed || false,
    };
    dispatch({ type: 'resource/save', resource });
    setEditing(null);
    setUpload(null);
    setNotice('Resource draft saved.');
  }

  function saveUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') || '').trim();
    if (!title) return;
    dispatch({ type: 'course-unit/add', unit: { id: `${courseCode}-unit-${Date.now()}`, course: courseCode, title, order: Number(data.get('order')) || courseUnits.length + 1, description: String(data.get('description') || '').trim() } });
    setAddingUnit(false);
    setNotice('Course unit added.');
  }

  function changeStatus(resource: StudioResource) {
    if (resource.status === 'Draft' && !resource.url && !resource.body?.trim()) { setNotice('Add lesson text, a file or an accessible resource link before publishing.'); return; }
    if (resource.status === 'Draft' && resource.type === 'Online resource' && !resource.approvedExternal) { setNotice('Confirm that this external resource has been reviewed before publishing.'); return; }
    dispatch({ type: 'resource/save', resource: { ...resource, status: resource.status === 'Published' ? 'Draft' : 'Published' } });
    setNotice(resource.status === 'Published' ? 'Returned to draft. Hidden from students.' : 'Resource published for enrolled students.');
  }

  return <div className="lecturer-materials-page">
    <h1 className="lecturer-materials-title">Materials</h1>
    <section className="lm-hero"><div><span>LECTURER / COURSE STUDIO</span><h2>Give every lesson the right resources.</h2><p>Organise units, prepare content and publish a clear learning path.</p></div><label>Assigned course<select value={courseCode} onChange={event => { setCourseCode(event.target.value); setQuery(''); setStatus('All'); setNotice(''); }}>{lecturerTeachingCourses.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select></label></section>
    <section className="lm-summary" aria-label="Materials summary"><div><span>Course units</span><strong>{courseUnits.length}</strong></div><div><span>Published resources</span><strong>{resources.filter(item => item.status === 'Published').length}</strong></div><div><span>Drafts</span><strong>{resources.filter(item => item.status === 'Draft').length}</strong></div></section>
    <p className="lm-demo-note">Recorded classes are available to students for seven days after publication.</p>
    {notice && <p className="lm-notice" role="status">{notice}</p>}
    <div className="lm-actions"><button type="button" className="lm-primary" onClick={() => { setEditing({ id: '', course: courseCode, title: '', type: 'Lecture notes', url: '', status: 'Draft', completed: false, unitId: courseUnits[0]?.id, order: resources.length + 1, allowDownload: true }); setUpload(null); setNotice(''); }}>+ Add resource</button><button type="button" className="lm-outline" onClick={() => { setAddingUnit(true); setEditing(null); setNotice(''); }}>+ Add course unit</button></div>
    <section className="lm-panel"><div className="lm-panel-heading"><h2>Course resources</h2><span>{resources.length} resources</span></div><div className="lm-filterbar"><input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search teaching resources" placeholder="Search title or resource type" /><select value={status} onChange={event => setStatus(event.target.value)} aria-label="Publication status"><option>All</option><option>Draft</option><option>Published</option></select></div>{visible.length ? <div className="lm-list">{visible.map(resource => <article className="lm-row" key={resource.id}><span className={`lm-icon ${isVideo(resource.type) ? 'video' : isAudio(resource.type) ? 'audio' : resource.type === 'Online resource' ? 'link' : ''}`} aria-hidden="true">{isVideo(resource.type) ? '▷' : isAudio(resource.type) ? '♫' : resource.type === 'Lesson' ? '▤' : '▧'}</span><div className="lm-row-title"><h3>{resource.title}</h3>{resource.type === 'Recorded class' && <small className="lm-expiry">Expired for students</small>}<small>{resource.type} · {unitTitle(resource)}</small></div><span className={`lm-status ${resource.status === 'Published' ? 'published' : ''}`}>{resource.status}</span><div className="lm-row-actions"><button type="button" onClick={() => setPreview(resource)}>Preview</button><button type="button" onClick={() => { setEditing(resource); setUpload(null); setNotice(''); }}>Edit</button><button type="button" className="lm-outline" onClick={() => changeStatus(resource)}>{resource.status === 'Published' ? 'Return to draft' : 'Publish'}</button></div></article>)}</div> : <div className="lm-empty"><h3>No matching resources</h3><p>Add a resource or adjust your filters.</p></div>}</section>
    {addingUnit && <StudentModal label="Add course unit" onClose={() => setAddingUnit(false)} className="lm-dialog"><button className="student-feature-close" type="button" aria-label="Close form" onClick={() => setAddingUnit(false)}>×</button><h2>New course unit</h2><form onSubmit={saveUnit}><div className="lm-form-grid"><label>Unit title<input required maxLength={160} name="title" placeholder="Unit 3 · Practical ministry" /></label><label>Display order<input required min={1} type="number" name="order" defaultValue={courseUnits.length + 1} /></label></div><label>Learning objectives / description<textarea name="description" rows={3} /></label><div className="lm-form-footer"><button type="submit" className="lm-primary">Save unit</button><button type="button" className="lm-outline" onClick={() => setAddingUnit(false)}>Cancel</button></div></form></StudentModal>}
    {editing && <StudentModal label={editing.id ? 'Edit resource' : 'Add learning resource'} onClose={() => setEditing(null)} className="lm-dialog"><button className="student-feature-close" type="button" aria-label="Close form" onClick={() => setEditing(null)}>×</button><div className="lm-dialog-heading"><h2>{editing.id ? 'Edit resource' : 'Prepare a learning resource'}</h2><span>Draft</span></div><form key={editing.id || 'new'} onSubmit={saveResource}><div className="lm-form-grid"><label>Resource title<input name="title" required maxLength={200} defaultValue={editing.title} /></label><label>Resource type<select name="type" defaultValue={editing.type}>{resourceTypes.map(type => <option key={type}>{type}</option>)}</select></label><label>Course unit<select name="unitId" required defaultValue={editing.unitId}>{courseUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.title}</option>)}</select></label><label>Display order<input name="order" type="number" required min={1} defaultValue={editing.order || 1} /></label></div><label>Short description<textarea name="description" rows={3} defaultValue={editing.description || ''} /></label><label>Lesson text / study instructions<textarea name="body" rows={6} defaultValue={editing.body || ''} placeholder="Explain the topic, key ideas and practical learning activities." /></label><div className="lm-upload"><label>Add or replace a file<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.webm,.mp3,.m4a,.wav" onChange={event => setUpload(event.target.files?.[0] || null)} /></label><small>{upload?.name || editing.fileName || 'Documents, presentations, video or audio · Maximum 100 MB'}</small></div><label>HTTPS resource link<input name="url" type="text" defaultValue={editing.url?.startsWith('blob:') ? '' : editing.url || ''} placeholder="https://…" /><small>Use an HTTPS resource link. Videos support YouTube embed links or direct MP4 / WebM files.</small></label><label className="lm-checkbox"><input name="allowDownload" type="checkbox" defaultChecked={editing.allowDownload !== false} />Allow a download link for students</label><label className="lm-checkbox"><input name="approvedExternal" type="checkbox" defaultChecked={editing.approvedExternal === true} />I have reviewed and approved this external learning resource</label><div className="lm-form-footer"><button type="submit" className="lm-primary">Save resource draft</button><button type="button" className="lm-outline" onClick={() => setEditing(null)}>Cancel</button></div></form></StudentModal>}
    {preview && <StudentModal label={preview.title} onClose={() => setPreview(null)} className="lm-preview"><div className="lm-preview-heading"><div><span>{preview.type}</span><h2>{preview.title}</h2></div><button type="button" className="lm-outline" onClick={() => setPreview(null)}>Close</button></div>{preview.description && <p>{preview.description}</p>}{preview.body && <div className="lm-preview-body">{preview.body}</div>}{preview.url && (isVideo(preview.type) ? <video controls preload="metadata" src={preview.url} /> : isAudio(preview.type) ? <audio controls src={preview.url} /> : <iframe title={preview.title} src={preview.url} sandbox="" />)}{!preview.url && !preview.body && <p>No preview content is available for this resource yet.</p>}<div className="lm-preview-footer"><span>Daniel Phiri · {course.code}</span>{preview.url && <a href={preview.url} target="_blank" rel="noreferrer">Open resource ↗</a>}</div></StudentModal>}
  </div>;
}
