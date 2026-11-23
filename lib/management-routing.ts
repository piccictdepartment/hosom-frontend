import type { RoleSlug } from './demo-data';
/** Server-safe route ownership. Workflow pages and Overview are handled elsewhere. */
const sections: Partial<Record<RoleSlug, readonly string[]>> = {
  secretariat: ['Manage Students', 'Documents', 'Reports'],
  finance: ['Reports', 'Documents', 'Mailer', 'Events'],
  administration: ['Approvals', 'Staff Management', 'Records', 'Documents', 'Reports', 'Events', 'Operations', 'Mailer'],
  'head-of-programs': ['Approvals', 'Programmes', 'Courses', 'Lecturers', 'Enrolment Monitoring', 'Assessment Monitoring', 'Academic Progress', 'Reports', 'Operations', 'Mailer'],
  'head-of-hosom': ['Operations', 'Reports', 'Mailer'],
  director: ['Approvals', 'Academic Performance', 'Finance Summary', 'Admissions & Students', 'Programmes', 'Certificates', 'Management Reviews', 'Reports', 'Mailer'],
  media: ['Media Library', 'Course Materials', 'Mailer'],
  'system-admin': ['Users', 'Staff Management', 'Roles & Permissions', 'Programmes', 'Courses', 'Academic Setup', 'Security & Sessions', 'Audit Trail', 'Integrations', 'Backups', 'System Settings', 'System Reports', 'Mailer'],
};
export function supportsManagementContent(role: RoleSlug, section: string): boolean { return sections[role]?.includes(section) ?? false; }
