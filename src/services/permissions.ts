import { UserRole } from '../types/auth';
import { NavigationPage } from '../types/crmExtended';

// ─── Per-page access ──────────────────────────────────────────────────────────
export const ALLOWED_PAGES: Record<UserRole, NavigationPage[]> = {
  Admin: [
    'Dashboard',
    'Add_Complaint',
    'View_All_Complaint',
    'Add_Breakdown',
    'View_All_Breakdown',
    'Add_Internal_Complaint',
    'View_All_Internal_Complaint',
    'Masters',
  ],
  Customer: [
    'Add_Complaint',
    'View_All_Complaint',
  ],
  Plant: [
    'Dashboard',
    'View_All_Complaint',
    'Add_Breakdown',
    'View_All_Breakdown',
    'Add_Internal_Complaint',
    'View_All_Internal_Complaint',
  ],
  CQA: [
    'Dashboard',
    'View_All_Complaint',
    'View_All_Breakdown',
    'View_All_Internal_Complaint',
    'Masters',
  ],
};

// ─── Fine-grained action permissions ─────────────────────────────────────────
export interface RolePermissions {
  // Complaints
  complaint_add:         boolean;
  complaint_edit:        boolean;
  complaint_delete:      boolean;
  complaint_assign:      boolean;
  complaint_assignL1:    boolean;
  complaint_report:      boolean;

  // Breakdown Logs
  breakdown_add:         boolean;
  breakdown_edit:        boolean;
  breakdown_delete:      boolean;

  // Internal Complaints
  internal_add:          boolean;
  internal_edit:         boolean;
  internal_delete:       boolean;

  // Masters
  masters_view:          boolean;
  masters_add:           boolean;
  masters_delete:        boolean;

  // User Management
  user_management:       boolean;

  // Dashboard
  dashboard_view:        boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: {
    complaint_add:      true,
    complaint_edit:     true,
    complaint_delete:   true,
    complaint_assign:   true,
    complaint_assignL1: true,
    complaint_report:   true,

    breakdown_add:      true,
    breakdown_edit:     true,
    breakdown_delete:   true,

    internal_add:       true,
    internal_edit:      true,
    internal_delete:    true,

    masters_view:       true,
    masters_add:        true,
    masters_delete:     true,

    user_management:    true,
    dashboard_view:     true,
  },

  Customer: {
    complaint_add:      true,
    complaint_edit:     false,   // view-only registry
    complaint_delete:   false,
    complaint_assign:   false,
    complaint_assignL1: false,
    complaint_report:   false,

    breakdown_add:      false,
    breakdown_edit:     false,
    breakdown_delete:   false,

    internal_add:       false,
    internal_edit:      false,
    internal_delete:    false,

    masters_view:       false,
    masters_add:        false,
    masters_delete:     false,

    user_management:    false,
    dashboard_view:     false,
  },

  Plant: {
    complaint_add:      false,
    complaint_edit:     true,    // can update status / CAPA
    complaint_delete:   false,
    complaint_assign:   false,
    complaint_assignL1: false,
    complaint_report:   true,

    breakdown_add:      true,
    breakdown_edit:     true,
    breakdown_delete:   true,   // own plant records

    internal_add:       true,
    internal_edit:      true,
    internal_delete:    true,   // own plant records

    masters_view:       false,
    masters_add:        false,
    masters_delete:     false,

    user_management:    false,
    dashboard_view:     true,
  },

  CQA: {
    complaint_add:      false,
    complaint_edit:     true,    // approve / assign / close
    complaint_delete:   false,
    complaint_assign:   true,
    complaint_assignL1: true,
    complaint_report:   true,

    breakdown_add:      false,
    breakdown_edit:     false,   // read-only for CQA
    breakdown_delete:   false,

    internal_add:       false,
    internal_edit:      false,   // read-only for CQA
    internal_delete:    false,

    masters_view:       true,
    masters_add:        false,
    masters_delete:     false,

    user_management:    false,
    dashboard_view:     true,
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
export const getPermissions = (role: UserRole): RolePermissions =>
  ROLE_PERMISSIONS[role];

export const canAccessPage = (role: UserRole, page: string): boolean =>
  (ALLOWED_PAGES[role] as string[]).includes(page) || page === 'User_Management' && role === 'Admin';
