import { AppUser, AuthSession, UserRole } from '../types/auth';

const USERS_KEY = 'ty_crm_users';
const SESSION_KEY = 'ty_crm_session';

// ─── Simple hash (btoa-based, suitable for demo/localStorage) ────────────────
const hashPassword = (pwd: string): string => btoa(encodeURIComponent(pwd + '::TY2026CRM'));

// ─── Seed default users ──────────────────────────────────────────────────────
const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-001',
    name: 'System Administrator',
    email: 'admin@tooyumm.com',
    passwordHash: hashPassword('Admin@2026'),
    role: 'Admin',
    status: 'Active',
    designation: 'CRM System Admin',
    phone: '+91-98100-00001',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Priya Sharma',
    email: 'cs@tooyumm.com',
    passwordHash: hashPassword('Customer@2026'),
    role: 'Customer',
    status: 'Active',
    designation: 'Consumer Relations Manager',
    phone: '+91-98100-00002',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr-003',
    name: 'Sunita Verma',
    email: 'plantqa@tooyumm.com',
    passwordHash: hashPassword('PlantQA@2026'),
    role: 'Plant',
    status: 'Active',
    designation: 'Plant QA Manager',
    plant: 'BD-02 — Baddi Extrusion & Baking Facility',
    phone: '+91-98100-00003',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'usr-004',
    name: 'Dr. Rajesh Sharma',
    email: 'cqa@tooyumm.com',
    passwordHash: hashPassword('CQA@2026'),
    role: 'CQA',
    status: 'Active',
    designation: 'Corporate Quality Assurance Lead',
    phone: '+91-98100-00004',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'usr-005',
    name: 'Rameshwar Pal',
    email: 'plantqa2@tooyumm.com',
    passwordHash: hashPassword('PlantQA@2026'),
    role: 'Plant',
    status: 'Active',
    designation: 'Plant QA Engineer',
    plant: 'GKP-01 — GKP Snacks Industries',
    phone: '+91-98100-00005',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
];

// ─── User Storage ────────────────────────────────────────────────────────────
export const getUsers = (): AppUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw) as AppUser[];
  } catch {
    return DEFAULT_USERS;
  }
};

const saveUsers = (users: AppUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// ─── Auth Operations ──────────────────────────────────────────────────────────
export const login = (email: string, password: string): { success: boolean; session?: AuthSession; error?: string } => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { success: false, error: 'No account found with this email address.' };
  if (user.status === 'Inactive') return { success: false, error: 'Your account has been deactivated. Contact your administrator.' };
  if (user.passwordHash !== hashPassword(password)) return { success: false, error: 'Incorrect password. Please try again.' };

  // Update last login
  const updated = users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
  saveUsers(updated);

  const session: AuthSession = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    plant: user.plant,
    designation: user.designation,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
};

// ─── CRUD Operations (Admin only) ────────────────────────────────────────────
export const createUser = (
  data: Omit<AppUser, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'> & { password: string },
  createdById: string
): { success: boolean; user?: AppUser; error?: string } => {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'A user with this email already exists.' };
  }
  const newUser: AppUser = {
    id: `usr-${Date.now()}`,
    name: data.name,
    email: data.email,
    passwordHash: hashPassword(data.password),
    role: data.role,
    status: data.status,
    plant: data.plant,
    phone: data.phone,
    designation: data.designation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: createdById,
  };
  saveUsers([...users, newUser]);
  return { success: true, user: newUser };
};

export const updateUser = (
  id: string,
  data: Partial<Omit<AppUser, 'id' | 'passwordHash' | 'createdAt'>> & { newPassword?: string }
): { success: boolean; error?: string } => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { success: false, error: 'User not found.' };

  const updated = {
    ...users[idx],
    ...data,
    updatedAt: new Date().toISOString(),
    ...(data.newPassword ? { passwordHash: hashPassword(data.newPassword) } : {}),
  };
  // Remove newPassword key
  delete (updated as any).newPassword;
  users[idx] = updated;
  saveUsers(users);
  return { success: true };
};

export const deleteUser = (id: string, adminId: string): { success: boolean; error?: string } => {
  if (id === adminId) return { success: false, error: 'You cannot delete your own account.' };
  const users = getUsers();
  if (!users.find(u => u.id === id)) return { success: false, error: 'User not found.' };
  saveUsers(users.filter(u => u.id !== id));
  return { success: true };
};

export const toggleUserStatus = (id: string, adminId: string): { success: boolean; error?: string } => {
  if (id === adminId) return { success: false, error: 'You cannot deactivate your own account.' };
  const users = getUsers();
  const user = users.find(u => u.id === id);
  if (!user) return { success: false, error: 'User not found.' };
  return updateUser(id, { status: user.status === 'Active' ? 'Inactive' : 'Active' });
};

export const resetPassword = (id: string, newPassword: string): { success: boolean; error?: string } => {
  return updateUser(id, { newPassword });
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const ROLE_META: Record<UserRole, { label: string; color: string; bg: string; border: string; desc: string }> = {
  Admin:    { label: 'Administrator', color: '#FF4A1C', bg: 'rgba(255,74,28,0.12)',   border: 'rgba(255,74,28,0.35)',   desc: 'Full system access & user management' },
  Customer: { label: 'Customer Service', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)', desc: 'Consumer complaint intake & follow-up' },
  Plant:    { label: 'Plant QA',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)',  desc: 'Plant investigation & CAPA execution' },
  CQA:      { label: 'Corporate QA', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', desc: 'CQA audit, approval & analytics' },
};
