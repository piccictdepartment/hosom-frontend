import type { RoleSlug } from '@/lib/demo-data';

const studentSections = new Set([
  'My Profile', 'My Courses', 'Learning Space', 'Library', 'Timetable', 'Transcript', 'Academic History',
  'Academic Updates', 'Communications', 'Profile Updates', 'Enrollment Requests',
]);
const lecturerSections = new Set([
  'My Courses', 'Materials', 'Live Classes', 'Attendance', 'Enrolled Students',
  'My Lecturer Profile', 'Report Centre', 'Reports', 'Course Performance', 'Academic Updates', 'Communications',
]);
export function supportsLearningContent(role: RoleSlug, section: string): boolean {
  return role === 'student' ? studentSections.has(section) : role === 'lecturer' ? lecturerSections.has(section) : false;
}
