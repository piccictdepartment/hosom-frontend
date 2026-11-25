import type { RoleSlug } from './demo-data';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:4000';

export const TOKEN_STORAGE_KEY = 'hosom_auth_token';
export const DEMO_MODE_STORAGE_KEY = 'hosom_demo_mode';

export type BackendRole =
  | 'STUDENT'
  | 'LECTURER'
  | 'SECRETARIAT'
  | 'FINANCE'
  | 'ADMINISTRATION'
  | 'HEAD_OF_PROGRAMS'
  | 'HEAD_OF_HOSOM'
  | 'DIRECTOR'
  | 'MEDIA'
  | 'SYSTEM_ADMIN';

const ROLE_TO_SLUG: Record<BackendRole, RoleSlug> = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  SECRETARIAT: 'secretariat',
  FINANCE: 'finance',
  ADMINISTRATION: 'administration',
  HEAD_OF_PROGRAMS: 'head-of-programs',
  HEAD_OF_HOSOM: 'head-of-hosom',
  DIRECTOR: 'director',
  MEDIA: 'media',
  SYSTEM_ADMIN: 'system-admin',
};

export function roleEnumToSlug(role: BackendRole): RoleSlug {
  return ROLE_TO_SLUG[role];
}

export interface CourseSummary {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  credits: number;
  status: string;
  _count?: { enrollments: number };
}

export interface StudentRecord {
  id: string;
  userId?: string;
  studentNumber: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'WITHDRAWN' | 'PENDING';
  gender: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  address: string | null;
  district: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  program: string | null;
  intake: string | null;
  yearOfStudy: number | null;
  modeOfLearning: string | null;
  user?: {
    id: string;
    firstName: string;
    middleName: string | null;
    surname: string;
    email: string;
    phone: string | null;
    role: BackendRole;
    isActive: boolean;
  };
  enrollments?: {
    id: string;
    status: string;
    enrolledAt: string;
    course: CourseSummary;
  }[];
}

export interface AuthUser {
  id: string;
  firstName: string;
  middleName: string | null;
  surname: string;
  email: string;
  phone: string | null;
  role: BackendRole;
  isActive: boolean;
  loggedInAt: string | null;
  student: StudentRecord | null;
  taughtCourses: {
    id: string;
    isPrimary: boolean;
    course: CourseSummary;
  }[];
}

export interface SessionRecord {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface CourseUnitRecord {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
}

export interface LearningMaterialRecord {
  id: string;
  courseId: string;
  unitId: string | null;
  title: string;
  description: string | null;
  body: string | null;
  type: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  order: number;
  url: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  allowDownload: boolean;
  approvedExternal: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  course?: { id: string; code: string; title: string };
  unit?: { id: string; title: string; order: number } | null;
  createdBy?: { id: string; firstName: string; surname: string };
}

export interface AssignmentRecord {
  id: string;
  courseId: string;
  title: string;
  instructions: string;
  totalMarks: number;
  submissionFormat: 'FILE' | 'TEXT' | 'BOTH';
  attachmentName: string | null;
  attachmentUrl: string | null;
  deadline: string;
  allowLate: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  publishedAt: string | null;
  course?: { id: string; code: string; title: string };
  _count?: { submissions: number };
}

export interface AssignmentSubmissionRecord {
  id: string;
  assignmentId: string;
  studentId: string;
  answerText: string | null;
  attachmentName: string | null;
  attachmentUrl: string | null;
  status: string;
  mark: number | null;
  feedback: string | null;
  submittedAt: string;
  isLate: boolean;
  assignment?: {
    id: string;
    title: string;
    courseId: string;
    totalMarks: number;
    deadline: string;
    course?: { id: string; code: string; title: string };
  };
  student?: {
    id: string;
    studentNumber: string | null;
    program: string | null;
    user: { id: string; firstName: string; surname: string; email: string };
  };
}

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function isDemoModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) === '1';
}

export function setDemoModeEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  if (enabled) {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, '1');
  } else {
    window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
  }
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<{ data: T; meta?: { pagination?: { page: number; limit: number; total: number; totalPages: number } } }> {
  const token = options.token === undefined ? getStoredToken() : options.token;
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      `Could not reach backend server at ${API_BASE_URL}. Make sure hosom-backend is running.`,
    );
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    throw new ApiClientError(
      response.status,
      json?.error?.code || 'REQUEST_FAILED',
      json?.error?.message || `Request failed with status ${response.status}`,
      json?.error?.details,
    );
  }

  return { data: json.data as T, meta: json.meta };
}
