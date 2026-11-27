'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/providers/auth-provider';
import { ApiClientError, type BackendRole } from '@/lib/api';
import {
  type AccountStatus,
  ALL_ROLES,
  createAdminUser,
  deleteAdminUser,
  DEPARTMENT_OPTIONS,
  type DirectoryUser,
  fetchAdminUsers,
  resetAdminUserPassword,
  ROLE_DIRECTORY_META,
  updateAdminUser,
} from '@/lib/admin-users-api';
import './system-admin-users.css';

function StatusBadge({ status }: { status: AccountStatus }) {
  const variant =
    status === 'Active'
      ? 'sau-status-active'
      : status === 'Locked'
        ? 'sau-status-locked'
        : 'sau-status-inactive';
  return <span className={`sau-status-badge ${variant}`}>{status}</span>;
}

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  let result = 'Hosom!';
  for (let i = 0; i < 8; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function nextDemoAccountCode(users: DirectoryUser[]): string {
  const maxNumber = users.reduce((max, item) => {
    const match = /^USR-(\d+)$/i.exec(item.accountCode);
    if (!match) return max;
    const value = Number(match[1]);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);
  return `USR-${String(maxNumber + 1).padStart(3, '0')}`;
}

function ModalDialog({
  label,
  onClose,
  compact = false,
  children,
}: {
  label: string;
  onClose: () => void;
  compact?: boolean;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="sau-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        className={`sau-dialog${compact ? ' sau-dialog-compact' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button
          type="button"
          className="sau-dialog-close"
          aria-label={`Close ${label}`}
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </section>
    </div>,
    document.body,
  );
}

function ViewUserModal({
  targetUser,
  isSelf,
  onClose,
  onEdit,
  onDelete,
}: {
  targetUser: DirectoryUser;
  isSelf: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <ModalDialog label={`User details for ${targetUser.fullName}`} onClose={onClose}>
      <p className="sau-dialog-kicker">USER DETAILS · {targetUser.accountCode}</p>
      <h2>{targetUser.fullName}</h2>
      <div className="sau-manage-meta">
        <StatusBadge status={targetUser.status} />
        <span>{targetUser.roleLabel}</span>
        <span>·</span>
        <span>{targetUser.department}</span>
      </div>

      <dl className="sau-detail-list">
        <div>
          <dt>FirstName</dt>
          <dd>{targetUser.firstName}</dd>
        </div>
        <div>
          <dt>MiddleName</dt>
          <dd>{targetUser.middleName || '—'}</dd>
        </div>
        <div>
          <dt>Surname</dt>
          <dd>{targetUser.surname}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{targetUser.email}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{targetUser.phone || '—'}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{targetUser.roleLabel}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={targetUser.status} />
          </dd>
        </div>
        <div>
          <dt>Account ID</dt>
          <dd>{targetUser.accountCode}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{targetUser.department}</dd>
        </div>
        {targetUser.lastLoginAt && (
          <div>
            <dt>Last sign-in</dt>
            <dd>{new Date(targetUser.lastLoginAt).toLocaleString()}</dd>
          </div>
        )}
      </dl>

      <div className="sau-dialog-actions">
        <button
          type="button"
          className="sau-btn-danger"
          disabled={isSelf}
          onClick={onDelete}
          title={isSelf ? 'You cannot delete your own active session account' : undefined}
        >
          Delete user
        </button>
        <button type="button" className="sau-btn-secondary" onClick={onClose}>
          Close
        </button>
        <button type="button" className="sau-btn-primary" onClick={onEdit}>
          Edit user
        </button>
      </div>
    </ModalDialog>
  );
}


function AddUserModal({
  isLiveBackend,
  suggestedCode,
  onClose,
  onCreated,
}: {
  isLiveBackend: boolean;
  suggestedCode: string;
  onClose: () => void;
  onCreated: (created: DirectoryUser) => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountCode, setAccountCode] = useState(suggestedCode);
  const [role, setRole] = useState<BackendRole>('LECTURER');
  const [department, setDepartment] = useState(
    ROLE_DIRECTORY_META.LECTURER.defaultDepartment,
  );
  const [departmentTouched, setDepartmentTouched] = useState(false);
  const [status, setStatus] = useState<AccountStatus>('Active');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRoleChange(nextRole: BackendRole) {
    setRole(nextRole);

    if (!departmentTouched) {
      setDepartment(ROLE_DIRECTORY_META[nextRole].defaultDepartment);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!firstName.trim() || !surname.trim() || !email.trim()) {
      setError('First Name, Surname, and Email are required.');
      return;
    }

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setSubmitting(true);

    try {
      if (isLiveBackend) {
        const created = await createAdminUser({
          firstName,
          middleName: middleName || undefined,
          surname,
          email,
          phone: phone || undefined,
          accountCode: accountCode || undefined,
          role,
          department,
          status,
          password: password || undefined,
        });

        onCreated(created);
      } else {
        const fullName = [
          firstName.trim(),
          middleName.trim(),
          surname.trim(),
        ]
          .filter(Boolean)
          .join(' ');

        const created: DirectoryUser = {
          id: `demo-usr-${Date.now()}`,
          accountCode: accountCode.trim() || suggestedCode,
          firstName: firstName.trim(),
          middleName: middleName.trim() || null,
          surname: surname.trim(),
          fullName,
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          role,
          roleLabel: ROLE_DIRECTORY_META[role].label,
          department:
            department.trim() ||
            ROLE_DIRECTORY_META[role].defaultDepartment,
          status,
          mfaEnabled: false,
          lastLoginAt: null,
          createdAt: new Date().toISOString(),
        };

        onCreated(created);
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Could not create user account. Please verify the details and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalDialog label="Add user" onClose={onClose}>
      <p className="sau-dialog-kicker">
        SYSTEM ADMINISTRATOR · CREATE USER
      </p>

      <h2>Add user</h2>

      <p className="sau-dialog-lead">
        Enter the user details below to create an account in the directory.
      </p>

      {error && (
        <div className="sau-dialog-alert" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="sau-form-grid">
          <label className="sau-field">
            First Name *
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Grace"
              autoComplete="given-name"
            />
          </label>

          <label className="sau-field">
            Middle Name
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional"
              autoComplete="additional-name"
            />
          </label>

          <label className="sau-field">
            Surname *
            <input
              type="text"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="e.g. Banda"
              autoComplete="family-name"
            />
          </label>

          <label className="sau-field">
            Email *
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hosom.edu"
              autoComplete="email"
            />
          </label>

          <label className="sau-field">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+265 999 000 000"
              autoComplete="tel"
            />
          </label>

          <label className="sau-field">
            Role *
            <select
              value={role}
              onChange={(e) =>
                handleRoleChange(e.target.value as BackendRole)
              }
            >
              {ALL_ROLES.map((item) => (
                <option key={item} value={item}>
                  {ROLE_DIRECTORY_META[item].label}
                </option>
              ))}
            </select>
          </label>

          <label className="sau-field">
            Status *
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as AccountStatus)
              }
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="sau-field">
            Department
            <input
              list="sau-department-options"
              value={department}
              onChange={(e) => {
                setDepartmentTouched(true);
                setDepartment(e.target.value);
              }}
              placeholder="e.g. Academics"
            />

            <datalist id="sau-department-options">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </label>

          <label className="sau-field">
            Account ID / Code
            <input
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              placeholder={suggestedCode}
            />
          </label>

          <label className="sau-field">
            Password
            <div className="sau-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />

              <button
                type="button"
                className="sau-mini-btn"
                onClick={() => {
                  const generatedPassword =
                    generateTemporaryPassword();

                  setPassword(generatedPassword);
                  setConfirmPassword(generatedPassword);
                  setShowPassword(true);
                }}
              >
                Generate
              </button>

              <button
                type="button"
                className="sau-mini-btn"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label className="sau-field">
            Confirm Password
            <input
              type={showPassword ? 'text' : 'password'}
              minLength={password ? 8 : undefined}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Re-enter password"
            />
          </label>
        </div>

        <div className="sau-dialog-actions">
          <button
            type="button"
            className="sau-btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="sau-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Creating user…' : 'Create user'}
          </button>
        </div>
      </form>
    </ModalDialog>
  );
}


function EditUserModal({
  targetUser,
  currentAdminId,
  isLiveBackend,
  onClose,
  onUpdated,
  onStatusMessage,
  onRequestDelete,
}: {
  targetUser: DirectoryUser;
  currentAdminId: string | null;
  isLiveBackend: boolean;
  onClose: () => void;
  onUpdated: (updated: DirectoryUser) => void;
  onStatusMessage: (message: string) => void;
  onRequestDelete: () => void;
}) {
  const [firstName, setFirstName] = useState(targetUser.firstName);
  const [middleName, setMiddleName] = useState(targetUser.middleName ?? '');
  const [surname, setSurname] = useState(targetUser.surname);
  const [email, setEmail] = useState(targetUser.email);
  const [phone, setPhone] = useState(targetUser.phone ?? '');
  const [role, setRole] = useState<BackendRole>(targetUser.role);
  const [status, setStatus] = useState<AccountStatus>(targetUser.status);
  const [department, setDepartment] = useState(targetUser.department);
  const [tempPassword, setTempPassword] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalNotice, setModalNotice] = useState<string | null>(null);

  const isSelf = Boolean(currentAdminId && currentAdminId === targetUser.id);
  const hasChanges =
    firstName.trim() !== targetUser.firstName ||
    middleName.trim() !== (targetUser.middleName ?? '') ||
    surname.trim() !== targetUser.surname ||
    email.trim().toLowerCase() !== targetUser.email.toLowerCase() ||
    phone.trim() !== (targetUser.phone ?? '') ||
    role !== targetUser.role ||
    status !== targetUser.status ||
    department.trim() !== targetUser.department;

  async function handleSaveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setModalNotice(null);

    if (!firstName.trim() || !surname.trim() || !email.trim()) {
      setError('FirstName, Surname, and Email are required.');
      return;
    }

    if (isSelf && status !== 'Active') {
      setError('You cannot lock or deactivate your own active administrator account.');
      return;
    }

    setSavingDetails(true);
    try {
      if (isLiveBackend) {
        const updated = await updateAdminUser(targetUser.id, {
          firstName,
          middleName: middleName || undefined,
          surname,
          email,
          phone: phone || undefined,
          accountCode: targetUser.accountCode,
          role,
          department,
          status,
        });
        onUpdated(updated);
      } else {
        const fullName = [firstName.trim(), middleName.trim(), surname.trim()]
          .filter(Boolean)
          .join(' ');
        onUpdated({
          ...targetUser,
          firstName: firstName.trim(),
          middleName: middleName.trim() || null,
          surname: surname.trim(),
          fullName,
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          role,
          roleLabel: ROLE_DIRECTORY_META[role].label,
          department: department.trim() || ROLE_DIRECTORY_META[role].defaultDepartment,
          status,
        });
      }
      setModalNotice('User details updated.');
      onStatusMessage(`Updated ${firstName.trim()} ${surname.trim()}.`);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : 'Failed to update user details.',
      );
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleResetPassword() {
    setError(null);
    setModalNotice(null);
    if (tempPassword && tempPassword.length < 8) {
      setError('Temporary password must be at least 8 characters.');
      return;
    }

    setResettingPassword(true);
    try {
      if (isLiveBackend) {
        const res = await resetAdminUserPassword(targetUser.id, tempPassword || undefined);
        setModalNotice(res.message);
        onStatusMessage(`Password reset applied for ${targetUser.fullName}.`);
      } else {
        setModalNotice(
          tempPassword
            ? `Temporary password staged in preview for ${targetUser.email}.`
            : `Password reset staged in preview for ${targetUser.email}.`,
        );
        onStatusMessage(`Password reset prepared for ${targetUser.fullName}.`);
      }
      setTempPassword('');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to reset password.');
    } finally {
      setResettingPassword(false);
    }
  }

  return (
    <ModalDialog label={`Edit ${targetUser.fullName}`} onClose={onClose}>
      <p className="sau-dialog-kicker">EDIT USER · {targetUser.accountCode}</p>
      <h2>{targetUser.fullName}</h2>
      <div className="sau-manage-meta">
        <StatusBadge status={targetUser.status} />
        <span>{targetUser.email}</span>
        <span>·</span>
        <span>{targetUser.roleLabel}</span>
      </div>

      {error && (
        <div className="sau-dialog-alert" role="alert">
          {error}
        </div>
      )}
      {modalNotice && (
        <div className="sau-dialog-success" role="status">
          {modalNotice}
        </div>
      )}

      <form onSubmit={handleSaveDetails}>
        <div className="sau-form-grid">
          <label className="sau-field">
            FirstName *
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="sau-field">
            MiddleName
            <input
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="sau-field">
            Surname *
            <input
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </label>
          <label className="sau-field">
            Email *
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="sau-field">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="sau-field">
            Role *
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as BackendRole)}
              disabled={isSelf}
            >
              {ALL_ROLES.map((item) => (
                <option key={item} value={item}>
                  {ROLE_DIRECTORY_META[item].label}
                </option>
              ))}
            </select>
          </label>
          <label className="sau-field">
            Status *
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AccountStatus)}
              disabled={isSelf}
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <label className="sau-field">
            Department
            <input
              list="sau-manage-department-options"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <datalist id="sau-manage-department-options">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="sau-dialog-actions">
          <button
            type="button"
            className="sau-btn-danger"
            disabled={isSelf}
            onClick={onRequestDelete}
          >
            Delete user
          </button>
          <button
            type="button"
            className="sau-btn-secondary"
            onClick={onClose}
            disabled={savingDetails}
          >
            Close
          </button>
          <button
            type="submit"
            className="sau-btn-primary"
            disabled={!hasChanges || savingDetails}
          >
            {savingDetails ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <div className="sau-section-block">
        <h3>Password recovery</h3>
        <p>
          Optionally set a temporary password (min 8 characters) or leave blank to trigger a
          server-side reset token.
        </p>
        <div className="sau-password-row">
          <input
            type="text"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Optional temporary password"
            style={{
              height: 40,
              border: '1px solid #d5e1ef',
              borderRadius: 6,
              padding: '0 12px',
              fontSize: 13,
              color: '#183555',
            }}
          />
          <button
            type="button"
            className="sau-mini-btn"
            onClick={() => setTempPassword(generateTemporaryPassword())}
          >
            Generate
          </button>
          <button
            type="button"
            className="sau-btn-secondary"
            disabled={resettingPassword}
            onClick={handleResetPassword}
          >
            {resettingPassword ? 'Resetting…' : 'Reset password'}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}

function DeleteUserModal({
  targetUser,
  isLiveBackend,
  onClose,
  onDeleted,
}: {
  targetUser: DirectoryUser;
  isLiveBackend: boolean;
  onClose: () => void;
  onDeleted: (deletedId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    setError(null);
    setDeleting(true);
    try {
      if (isLiveBackend) {
        await deleteAdminUser(targetUser.id);
      }
      onDeleted(targetUser.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : 'Could not delete user account.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <ModalDialog label={`Delete ${targetUser.fullName}`} onClose={onClose} compact>
      <p className="sau-dialog-kicker">CONFIRM DELETION · {targetUser.accountCode}</p>
      <h2>Delete user?</h2>
      <p className="sau-dialog-lead">
        This will remove <strong>{targetUser.fullName}</strong> ({targetUser.email}) from the user
        directory. This action cannot be undone.
      </p>

      {error && (
        <div className="sau-dialog-alert" role="alert">
          {error}
        </div>
      )}

      <div className="sau-dialog-actions">
        <button
          type="button"
          className="sau-btn-secondary"
          onClick={onClose}
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="sau-btn-danger-solid"
          onClick={handleConfirmDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete user'}
        </button>
      </div>
    </ModalDialog>
  );
}

export function SystemAdminUsers() {
  const { user } = useAuth();

  // Never initialise the live directory with demo records.
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [dataSource, setDataSource] = useState<'preview' | 'live' | 'fallback'>('preview');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<BackendRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'All'>('All');
  const [addingUser, setAddingUser] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const loadUsers = useCallback(async () => {
    // A real authenticated session is required for the protected API.
    if (!user) {
      setUsers([]);
      setDataSource('preview');
      setSyncError('You must be signed in to retrieve users from the backend.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);

    try {
      // Fetch the directory from the backend API.
      const { users: remoteUsers } = await fetchAdminUsers();

      setUsers(remoteUsers);
      setDataSource('live');
      setSyncError(null);
    } catch (err) {
      // Do not replace failed backend results with demo records.
      setUsers([]);
      setDataSource('fallback');

      setSyncError(
        err instanceof ApiClientError
          ? `Could not load users (${err.status || err.code}): ${err.message}`
          : err instanceof Error
            ? `Could not connect to the user API: ${err.message}`
            : 'Could not connect to the backend user directory.',
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load users whenever the signed-in account becomes available.
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const visibleUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return users.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (roleFilter !== 'All' && item.role !== roleFilter) return false;
      if (!normalized) return true;
      return `${item.firstName} ${item.middleName ?? ''} ${item.surname} ${item.email} ${item.phone ?? ''} ${item.roleLabel} ${item.department} ${item.status} ${item.accountCode}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [users, query, roleFilter, statusFilter]);

  const viewingUser = useMemo(
    () => users.find((item) => item.id === viewingId) ?? null,
    [users, viewingId],
  );
  const editingUser = useMemo(
    () => users.find((item) => item.id === editingId) ?? null,
    [users, editingId],
  );
  const deletingUser = useMemo(
    () => users.find((item) => item.id === deletingId) ?? null,
    [users, deletingId],
  );

  const isLiveBackend = dataSource === 'live';

  function handleUserCreated(created: DirectoryUser) {
    setUsers((prev) => [created, ...prev]);
    setToast({
      message: `Added ${created.fullName} (${created.roleLabel}) to the user directory.`,
    });
  }

  function handleUserUpdated(updated: DirectoryUser) {
    setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }

  function handleUserDeleted(deletedId: string) {
    const removed = users.find((item) => item.id === deletedId);
    setUsers((prev) => prev.filter((item) => item.id !== deletedId));
    setToast({
      message: removed
        ? `Deleted ${removed.fullName} (${removed.email}) from the directory.`
        : 'User account deleted.',
    });
  }

  return (
    <div className="sau-page">
      <header className="sau-header">
  <p className="sau-eyebrow">SYSTEM ADMINISTRATOR WORKSPACE</p>
  <h1>Users</h1>
  <p>Manage system users, roles, access and account status.</p>
</header>

      {dataSource === 'live' ? (
        <div className="sau-banner sau-banner-live" role="status">
          <span>
            System Administrator · Connected to live user directory ({users.length} accounts).
          </span>
          <button type="button" className="sau-banner-action" onClick={loadUsers}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      ) : dataSource === 'fallback' ? (
  <div className="sau-banner sau-banner-warn" role="alert">
    <span>{syncError || 'The backend user directory is unavailable.'}</span>
    <button
      type="button"
      className="sau-banner-action"
      onClick={loadUsers}
      disabled={loading}
    >
      {loading ? 'Connecting…' : 'Retry connection'}
    </button>
  </div>
     ) : (
  <div className="sau-banner" role="status">
    <span>
      Backend connection has not been established. Sign in with an authenticated account
      to retrieve the live user directory.
    </span>
  </div>
)}

      {toast && (
        <div
          className={`sau-toast${toast.isError ? ' sau-toast-error' : ''}`}
          role="status"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}

      <section className="sau-card" aria-label="User directory">
        <div className="sau-card-head">
          <div>
            <h2>User directory</h2>
            <p>
              Create, view, edit, and manage user accounts across all roles and departments.
            </p>
          </div>
          <button
  type="button"
  className="sau-add-btn"
  onClick={() => setAddingUser(true)}
  disabled={!isLiveBackend || loading}
  title={
    !isLiveBackend
      ? 'Connect to the backend before creating users'
      : 'Add a new user'
  }
>
  + Add user
</button>
        </div>

        <div className="sau-filters">
          <div className="sau-search-wrap">
            <label htmlFor="sau-user-search" className="sr-only">
              Search user directory
            </label>
            <input
              id="sau-user-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this section..."
            />
          </div>
          <div className="sau-select-wrap">
            <label htmlFor="sau-role-filter" className="sr-only">
              Filter by role
            </label>
            <select
              id="sau-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as BackendRole | 'All')}
            >
              <option value="All">All roles</option>
              {ALL_ROLES.map((item) => (
                <option key={item} value={item}>
                  {ROLE_DIRECTORY_META[item].label}
                </option>
              ))}
            </select>
          </div>
          <div className="sau-select-wrap">
            <label htmlFor="sau-status-filter" className="sr-only">
              Filter by account status
            </label>
            <select
              id="sau-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as AccountStatus | 'All')
              }
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="sau-table-wrap">
          <table className="sau-table">
            <thead>
  <tr>
    <th>FIRST NAME</th>
    <th>MIDDLE NAME</th>
    <th>SURNAME</th>
    <th>EMAIL</th>
    <th>PHONE</th>
    <th>ROLE</th>
    <th>STATUS</th>
    <th>ACTIONS</th>
  </tr>
</thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="sau-empty">
                    Loading user directory…
                  </td>
                </tr>
              ) : visibleUsers.length > 0 ? (
                visibleUsers.map((item) => {
                  const isSelf = Boolean(user?.id && user.id === item.id);
                  return (
                    <tr key={item.id}>
                      <td className="sau-cell-primary">{item.firstName}</td>
                      <td className={item.middleName ? undefined : 'sau-cell-muted'}>
                        {item.middleName || '—'}
                      </td>
                      <td className="sau-cell-primary">{item.surname}</td>
                      <td className="sau-cell-email">{item.email}</td>
                      <td className={item.phone ? undefined : 'sau-cell-muted'}>
                        {item.phone || '—'}
                      </td>
                      <td>{item.roleLabel}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        <div className="sau-row-actions">
                          <button
                            type="button"
                            className="sau-action-link sau-action-view"
                            onClick={() => setViewingId(item.id)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="sau-action-link"
                            onClick={() => setEditingId(item.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="sau-action-link sau-action-delete"
                            disabled={isSelf}
                            title={
                              isSelf
                                ? 'You cannot delete your own active session account'
                                : undefined
                            }
                            onClick={() => setDeletingId(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="sau-empty">
                   {dataSource === 'fallback'
  ? 'Users could not be loaded from the backend. Check the connection and retry.'
  : 'No user accounts match your search or filters.'}
                    {(query || roleFilter !== 'All' || statusFilter !== 'All') && (
                      <button
                        type="button"
                        className="sau-clear-btn"
                        onClick={() => {
                          setQuery('');
                          setRoleFilter('All');
                          setStatusFilter('All');
                        }}
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sau-table-footer">
          <span>
            Showing {visibleUsers.length} of {users.length} user accounts
          </span>
          <span>
            {isLiveBackend ? 'Synced with backend API' : 'Interactive preview state'}
          </span>
        </div>
      </section>

      {addingUser && (
        <AddUserModal
          isLiveBackend={isLiveBackend}
          suggestedCode={nextDemoAccountCode(users)}
          onClose={() => setAddingUser(false)}
          onCreated={handleUserCreated}
        />
      )}

      {viewingUser && (
        <ViewUserModal
          targetUser={viewingUser}
          isSelf={Boolean(user?.id && user.id === viewingUser.id)}
          onClose={() => setViewingId(null)}
          onEdit={() => {
            const id = viewingUser.id;
            setViewingId(null);
            setEditingId(id);
          }}
          onDelete={() => {
            const id = viewingUser.id;
            setViewingId(null);
            setDeletingId(id);
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          targetUser={editingUser}
          currentAdminId={user?.id ?? null}
          isLiveBackend={isLiveBackend}
          onClose={() => setEditingId(null)}
          onUpdated={handleUserUpdated}
          onStatusMessage={(message) => setToast({ message })}
          onRequestDelete={() => {
            const id = editingUser.id;
            setEditingId(null);
            setDeletingId(id);
          }}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          targetUser={deletingUser}
          isLiveBackend={isLiveBackend}
          onClose={() => setDeletingId(null)}
          onDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
