// ─── Auth Types ──────────────────────────────────────────────────────────────
export type UserRole = 'Admin' | 'Customer' | 'Plant' | 'CQA';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  plant?: string;           // For Plant QA users
  phone?: string;
  designation?: string;
  avatar?: string;          // initials fallback
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  createdBy?: string;       // id of admin who created
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  plant?: string;
  designation?: string;
  loginAt: string;
}
