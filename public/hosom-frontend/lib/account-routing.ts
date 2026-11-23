import type { RoleSlug } from './demo-data';
/** Server-safe routing for account controls and the two remaining mailer portals. */
export function supportsAccountContent(role: RoleSlug, section: string): boolean {
  if (['student', 'lecturer'].includes(role) && ['Account Security', 'Notification Preferences'].includes(section)) return true;
  return ['lecturer', 'secretariat'].includes(role) && section === 'Mailer';
}
