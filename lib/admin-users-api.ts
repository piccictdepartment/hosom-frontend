import {
  apiRequest,
  type BackendRole,
  roleEnumToSlug,
} from './api';
import { roles } from './demo-data';

/**
 * Central endpoint map for System Administrator user CRUD management.
 * Update these paths in one place if your backend routes differ.
 */
export const ADMIN_USERS_ENDPOINTS = {
  list: '/api/users',
  getById: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
  create: '/api/users',
  update: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
  updateStatus: (userId: string) => `/api/users/${encodeURIComponent(userId)}/status`,
  resetPassword: (userId: string) => `/api/users/${encodeURIComponent(userId)}/reset-password`,
  delete: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
} as const;

export type AccountStatus = 'Active' | 'Locked' | 'Inactive';

export interface DirectoryUser {
  id: string;
  accountCode: string;
  firstName: string;
  middleName: string | null;
  surname: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: BackendRole;
  roleLabel: string;
  department: string;
  status: AccountStatus;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string | null;
}

export interface BackendUserDto {
  id: string;
  accountCode?: string | null;
  staffCode?: string | null;
  userCode?: string | null;
  firstName: string;
  middleName?: string | null;
  surname: string;
  email: string;
  phone?: string | null;
  role: BackendRole;
  department?: string | null;
  isActive?: boolean;
  isLocked?: boolean;
  status?: string | null;
  mfaEnabled?: boolean;
  loggedInAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  student?: {
    studentNumber?: string | null;
  } | null;
}

export interface CreateAdminUserInput {
  firstName: string;
  middleName?: string;
  surname: string;
  email: string;
  phone?: string;
  accountCode?: string;
  role: BackendRole;
  department?: string;
  status: AccountStatus;
  password?: string;
}

export interface UpdateAdminUserInput {
  firstName: string;
  middleName?: string;
  surname: string;
  email: string;
  phone?: string;
  accountCode?: string;
  role: BackendRole;
  department?: string;
  status: AccountStatus;
}

export interface FetchAdminUsersParams {
  search?: string;
  status?: AccountStatus | 'All';
  role?: BackendRole | 'All';
  page?: number;
  limit?: number;
}

export const ROLE_DIRECTORY_META: Record<
  BackendRole,
  { label: string; defaultDepartment: string }
> = {
  STUDENT: { label: roles.student.label, defaultDepartment: 'Students' },
  LECTURER: { label: roles.lecturer.label, defaultDepartment: 'Academics' },
  SECRETARIAT: { label: roles.secretariat.label, defaultDepartment: 'Secretariat' },
  FINANCE: { label: roles.finance.label, defaultDepartment: 'Finance' },
  ADMINISTRATION: { label: roles.administration.label, defaultDepartment: 'Administration' },
  HEAD_OF_PROGRAMS: { label: roles['head-of-programs'].label, defaultDepartment: 'Academics' },
  HEAD_OF_HOSOM: { label: roles['head-of-hosom'].label, defaultDepartment: 'Leadership' },
  DIRECTOR: { label: roles.director.label, defaultDepartment: 'Executive' },
  MEDIA: { label: roles.media.label, defaultDepartment: 'Media' },
  SYSTEM_ADMIN: { label: roles['system-admin'].label, defaultDepartment: 'ICT' },
};

export const ALL_ROLES: BackendRole[] = Object.keys(ROLE_DIRECTORY_META) as BackendRole[];

export const DEPARTMENT_OPTIONS = [
  'Academics',
  'Administration',
  'Executive',
  'Finance',
  'ICT',
  'Leadership',
  'Media',
  'Secretariat',
  'Students',
] as const;

export function normalizeAccountStatus(
  dto: Pick<BackendUserDto, 'status' | 'isActive' | 'isLocked'>,
): AccountStatus {
  const raw = dto.status?.trim().toUpperCase();
  if (raw === 'LOCKED') return 'Locked';
  if (raw === 'INACTIVE' || raw === 'SUSPENDED' || raw === 'DISABLED') return 'Inactive';
  if (raw === 'ACTIVE') return 'Active';
  if (dto.isLocked) return 'Locked';
  if (dto.isActive === false) return 'Inactive';
  return 'Active';
}

export function mapBackendUserToDirectoryUser(dto: BackendUserDto): DirectoryUser {
  const meta = ROLE_DIRECTORY_META[dto.role] ?? {
    label: roles[roleEnumToSlug(dto.role)]?.label ?? dto.role,
    defaultDepartment: 'General',
  };
  const fullName = [dto.firstName, dto.middleName, dto.surname]
    .filter(Boolean)
    .join(' ')
    .trim();
  const accountCode =
    dto.accountCode ||
    dto.staffCode ||
    dto.userCode ||
    dto.student?.studentNumber ||
    dto.id;

  return {
    id: dto.id,
    accountCode,
    firstName: dto.firstName,
    middleName: dto.middleName ?? null,
    surname: dto.surname,
    fullName: fullName || dto.email,
    email: dto.email,
    phone: dto.phone ?? null,
    role: dto.role,
    roleLabel: meta.label,
    department: dto.department?.trim() || meta.defaultDepartment,
    status: normalizeAccountStatus(dto),
    mfaEnabled: Boolean(dto.mfaEnabled),
    lastLoginAt: dto.lastLoginAt ?? dto.loggedInAt ?? null,
    createdAt: dto.createdAt ?? null,
  };
}

export async function fetchAdminUsers(params: FetchAdminUsersParams = {}): Promise<{
  users: DirectoryUser[];
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params.search?.trim()) searchParams.set('search', params.search.trim());
  if (params.status && params.status !== 'All') searchParams.set('status', params.status.toUpperCase());
  if (params.role && params.role !== 'All') searchParams.set('role', params.role);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  const path = qs ? `${ADMIN_USERS_ENDPOINTS.list}?${qs}` : ADMIN_USERS_ENDPOINTS.list;

  const { data, meta } = await apiRequest<
    BackendUserDto[] | { users?: BackendUserDto[]; items?: BackendUserDto[] }
  >(path);

  const list = Array.isArray(data) ? data : data.users ?? data.items ?? [];
  const users = list.map(mapBackendUserToDirectoryUser);
  const total = meta?.pagination?.total ?? users.length;
  return { users, total };
}

export async function fetchAdminUserById(userId: string): Promise<DirectoryUser> {
  const { data } = await apiRequest<BackendUserDto | { user: BackendUserDto }>(
    ADMIN_USERS_ENDPOINTS.getById(userId),
  );
  const dto = 'user' in data ? data.user : data;
  return mapBackendUserToDirectoryUser(dto);
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<DirectoryUser> {
  const department = input.department?.trim() || ROLE_DIRECTORY_META[input.role].defaultDepartment;
  const { data } = await apiRequest<BackendUserDto | { user: BackendUserDto }>(
    ADMIN_USERS_ENDPOINTS.create,
    {
      method: 'POST',
      body: {
        firstName: input.firstName.trim(),
        middleName: input.middleName?.trim() || null,
        surname: input.surname.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || null,
        accountCode: input.accountCode?.trim() || undefined,
        role: input.role,
        department,
        status: input.status.toUpperCase(),
        isActive: input.status === 'Active',
        isLocked: input.status === 'Locked',
        ...(input.password ? { password: input.password } : {}),
      },
    },
  );

  const dto = 'user' in data ? data.user : data;
  return mapBackendUserToDirectoryUser(dto);
}

export async function updateAdminUser(
  userId: string,
  input: UpdateAdminUserInput,
): Promise<DirectoryUser> {
  const department = input.department?.trim() || ROLE_DIRECTORY_META[input.role].defaultDepartment;
  const { data } = await apiRequest<BackendUserDto | { user: BackendUserDto }>(
    ADMIN_USERS_ENDPOINTS.update(userId),
    {
      method: 'PATCH',
      body: {
        firstName: input.firstName.trim(),
        middleName: input.middleName?.trim() || null,
        surname: input.surname.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || null,
        accountCode: input.accountCode?.trim() || undefined,
        role: input.role,
        department,
        status: input.status.toUpperCase(),
        isActive: input.status === 'Active',
        isLocked: input.status === 'Locked',
      },
    },
  );

  const dto = 'user' in data ? data.user : data;
  return mapBackendUserToDirectoryUser(dto);
}

export async function updateAdminUserStatus(
  userId: string,
  status: AccountStatus,
  reason?: string,
): Promise<DirectoryUser> {
  const { data } = await apiRequest<BackendUserDto | { user: BackendUserDto }>(
    ADMIN_USERS_ENDPOINTS.updateStatus(userId),
    {
      method: 'PATCH',
      body: {
        status: status.toUpperCase(),
        isActive: status === 'Active',
        isLocked: status === 'Locked',
        reason: reason?.trim() || undefined,
      },
    },
  );

  const dto = 'user' in data ? data.user : data;
  return mapBackendUserToDirectoryUser(dto);
}

export async function resetAdminUserPassword(
  userId: string,
  temporaryPassword?: string,
): Promise<{ message: string }> {
  const { data } = await apiRequest<{ message?: string }>(
    ADMIN_USERS_ENDPOINTS.resetPassword(userId),
    {
      method: 'POST',
      body: temporaryPassword ? { temporaryPassword } : {},
    },
  );

  return {
    message: data?.message || 'Password reset has been applied.',
  };
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await apiRequest<void>(ADMIN_USERS_ENDPOINTS.delete(userId), {
    method: 'DELETE',
  });
}

/**
 * Sample directory records for demo mode & offline UI preview.
 */
export const INITIAL_DEMO_USERS: DirectoryUser[] = [
  {
    id: 'demo-usr-001',
    accountCode: 'USR-001',
    firstName: 'Thoko',
    middleName: 'Grace',
    surname: 'Banda',
    fullName: 'Thoko Grace Banda',
    email: 'thoko.banda@student.hosom.edu',
    phone: '+265 999 101 201',
    role: 'STUDENT',
    roleLabel: 'Student',
    department: 'Students',
    status: 'Active',
    mfaEnabled: false,
    lastLoginAt: null,
    createdAt: '2026-08-12T09:00:00Z',
  },
  {
    id: 'demo-usr-002',
    accountCode: 'USR-002',
    firstName: 'Daniel',
    middleName: null,
    surname: 'Phiri',
    fullName: 'Daniel Phiri',
    email: 'lecturer1@hosom.edu',
    phone: '+265 999 045 869',
    role: 'LECTURER',
    roleLabel: 'Lecturer',
    department: 'Academics',
    status: 'Locked',
    mfaEnabled: true,
    lastLoginAt: '2026-10-19T16:45:00Z',
    createdAt: '2026-07-04T08:30:00Z',
  },
  {
    id: 'demo-usr-003',
    accountCode: 'USR-003',
    firstName: 'Peter',
    middleName: 'Chisomo',
    surname: 'Mwale',
    fullName: 'Peter Chisomo Mwale',
    email: 'finance@hosom.edu',
    phone: '+265 888 214 330',
    role: 'FINANCE',
    roleLabel: 'Finance',
    department: 'Finance',
    status: 'Active',
    mfaEnabled: true,
    lastLoginAt: '2026-10-20T09:10:00Z',
    createdAt: '2026-06-15T10:15:00Z',
  },
  {
    id: 'demo-usr-004',
    accountCode: 'USR-004',
    firstName: 'Alex',
    middleName: null,
    surname: 'Mercer',
    fullName: 'Alex Mercer',
    email: 'sysadmin@hosom.edu',
    phone: '+265 991 300 410',
    role: 'SYSTEM_ADMIN',
    roleLabel: 'System Administrator',
    department: 'ICT',
    status: 'Active',
    mfaEnabled: true,
    lastLoginAt: '2026-10-20T09:15:00Z',
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'demo-usr-005',
    accountCode: 'HOSOM/HEAD/001',
    firstName: 'Samuel',
    middleName: 'Kondwani',
    surname: 'Chirwa',
    fullName: 'Samuel Kondwani Chirwa',
    email: 'head@hosom.edu',
    phone: '+265 884 512 900',
    role: 'HEAD_OF_HOSOM',
    roleLabel: 'Head of HOSOM',
    department: 'Leadership',
    status: 'Active',
    mfaEnabled: false,
    lastLoginAt: null,
    createdAt: '2026-06-01T11:20:00Z',
  },
];
