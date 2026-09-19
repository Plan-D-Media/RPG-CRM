import React, { useState, useEffect } from 'react';
import { AppUser, UserRole } from '../types/auth';
import { AuthSession } from '../types/auth';
import {
  getUsers, createUser, updateUser, deleteUser, toggleUserStatus, resetPassword, ROLE_META,
} from '../services/authService';
import {
  Users, UserPlus, Pencil, Trash2, ShieldCheck, Eye, EyeOff,
  X, AlertCircle, CheckCircle2, RefreshCw, Search, Activity,
  Lock, ToggleLeft, ToggleRight, Building2, Phone, Clock,
} from 'lucide-react';

interface UserManagementProps {
  session: AuthSession;
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(15,21,37,0.9)', border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '8px', color: '#F8FAFC', padding: '9px 12px', fontFamily: 'inherit',
  fontSize: '0.875rem', outline: 'none', height: '40px',
};
const Lbl: React.FC<{ text: string }> = ({ text }) => (
  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>{text}</label>
);

// ─── CREATE / EDIT USER MODAL ─────────────────────────────────────────────────
const UserFormModal: React.FC<{
  mode: 'create' | 'edit';
  user?: AppUser;
  session: AuthSession;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ mode, user, session, onSuccess, onClose }) => {
  const [name, setName]           = useState(user?.name ?? '');
  const [email, setEmail]         = useState(user?.email ?? '');
  const [role, setRole]           = useState<UserRole>(user?.role ?? 'Customer');
  const [status, setStatus]       = useState<'Active'|'Inactive'>(user?.status ?? 'Active');
  const [plant, setPlant]         = useState(user?.plant ?? '');
  const [phone, setPhone]         = useState(user?.phone ?? '');
  const [designation, setDesig]   = useState(user?.designation ?? '');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const plantList = ['BD-02 — Baddi Extrusion & Baking Facility','GKP-01 — GKP Snacks Industries','GS-01 — Geeta Snacks & Savouries','PP-01 — Pampar Foods Pvt Ltd','BE-01 — Badshah Extrusion Plant','AT-01 — Atop Foods Co-Packer','PW-01 — Patwari Foods Facility','GR-01 — GRTS Manufacturing Hub','DV-01 — Devarpan Foods Ltd','HD-01 — Haridwar SIDCUL Unit 1'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'create' && !password) { setError('Password is required for new users.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (mode === 'create') {
      const res = createUser({ name, email, role, status, plant: role === 'Plant' ? plant : undefined, phone, designation, password }, session.userId);
      if (!res.success) { setError(res.error ?? 'Failed to create user.'); setLoading(false); return; }
    } else if (user) {
      const res = updateUser(user.id, {
        name, email, role, status, plant: role === 'Plant' ? plant : undefined, phone, designation,
        ...(password ? { newPassword: password } : {}),
      });
      if (!res.success) { setError(res.error ?? 'Failed to update user.'); setLoading(false); return; }
    }

    setLoading(false);
    onSuccess();
    onClose();
  };

  const isCreate = mode === 'create';
  const accentColor = isCreate ? '#10B981' : '#FFA000';
  const accentBg = isCreate ? 'rgba(16,185,129,0.15)' : 'rgba(255,160,0,0.15)';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: `1px solid ${accentColor}55` }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', background: `linear-gradient(90deg,${accentBg} 0%,rgba(17,23,38,0.95) 100%)`, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isCreate ? <UserPlus size={18} color={accentColor} /> : <Pencil size={18} color={accentColor} />}
            {isCreate ? 'Create New User' : `Edit User — ${user?.name}`}
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ margin: '14px 24px 0', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', color: '#FCA5A5', fontSize: '0.8rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><Lbl text="Full Name" /><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rahul Sharma" /></div>
              <div><Lbl text="Email Address" /><input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@tooyumm.com" /></div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <Lbl text="Role / Access Level" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={role} onChange={e => setRole(e.target.value as UserRole)}>
                  {(Object.keys(ROLE_META) as UserRole[]).map(r => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Lbl text="Account Status" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={status} onChange={e => setStatus(e.target.value as 'Active'|'Inactive')}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><Lbl text="Designation / Title" /><input style={inputStyle} value={designation} onChange={e => setDesig(e.target.value)} placeholder="e.g. QA Manager" /></div>
              <div><Lbl text="Phone Number" /><input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91-98100-XXXXX" /></div>
            </div>

            {/* Plant (only for Plant role) */}
            {role === 'Plant' && (
              <div>
                <Lbl text="Assigned Plant / Facility" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={plant} onChange={e => setPlant(e.target.value)}>
                  <option value="">-- Select Plant --</option>
                  {plantList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <Lbl text={isCreate ? 'Password' : 'New Password (leave blank to keep current)'} />
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required={isCreate}
                  placeholder={isCreate ? 'Min 8 characters' : 'Leave blank to keep unchanged'}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role description */}
            <div style={{ padding: '10px 14px', background: `${ROLE_META[role].bg}`, border: `1px solid ${ROLE_META[role].border}`, borderRadius: '8px', fontSize: '0.78rem', color: ROLE_META[role].color }}>
              <strong>{ROLE_META[role].label}:</strong> {ROLE_META[role].desc}
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', background: isCreate ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: '9px', color: '#FFF', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isCreate ? '0 4px 14px rgba(16,185,129,0.35)' : '0 4px 14px rgba(245,158,11,0.35)' }}>
                {loading ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</> : <><CheckCircle2 size={16} />{isCreate ? 'Create User' : 'Save Changes'}</>}
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '11px 20px' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── RESET PASSWORD MODAL ─────────────────────────────────────────────────────
const ResetPwdModal: React.FC<{ user: AppUser; onSuccess: () => void; onClose: () => void }> = ({ user, onSuccess, onClose }) => {
  const [pwd, setPwd]       = useState('');
  const [showPwd, setShow]  = useState(false);
  const [error, setError]   = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const res = resetPassword(user.id, pwd);
    if (!res.success) { setError(res.error ?? 'Failed.'); return; }
    onSuccess(); onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.4)' }}>
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(167,139,250,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={17} color="#A78BFA" /> Reset Password — {user.name}</div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>
        <form onSubmit={handleReset} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#FCA5A5', fontSize: '0.8rem' }}>{error}</div>}
          <div>
            <Lbl text="New Password" />
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: '40px' }} type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} required placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', border: 'none', borderRadius: '9px', color: '#FFF', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Lock size={15} /> Reset Password</button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '11px 18px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── DELETE CONFIRM MODAL ─────────────────────────────────────────────────────
const DeleteConfirmModal: React.FC<{ user: AppUser; session: AuthSession; onSuccess: () => void; onClose: () => void }> = ({ user, session, onSuccess, onClose }) => {
  const [error, setError] = useState('');
  const handle = () => {
    const res = deleteUser(user.id, session.userId);
    if (!res.success) { setError(res.error ?? 'Failed.'); return; }
    onSuccess(); onClose();
  };
  const meta = ROLE_META[user.role];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.4)' }}>
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(239,68,68,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}><Trash2 size={17} color="#EF4444" /> Delete User Account</div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>
        <div style={{ padding: '24px' }}>
          {error && <div style={{ marginBottom: '14px', padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#FCA5A5', fontSize: '0.8rem' }}>{error}</div>}
          <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', marginBottom: '18px', lineHeight: 1.7, fontSize: '0.87rem', color: '#F8FAFC' }}>
            Are you sure you want to permanently delete user<br />
            <strong style={{ color: '#FFF', fontSize: '1rem' }}>{user.name}</strong>
            {' '}<span style={{ color: meta.color, fontSize: '0.78rem', padding: '1px 7px', background: meta.bg, borderRadius: '5px' }}>{meta.label}</span>?<br />
            <span style={{ color: '#F87171', fontSize: '0.79rem', marginTop: '6px', display: 'block' }}>⚠ This cannot be undone. The user will lose all access.</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handle} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', border: 'none', borderRadius: '9px', color: '#FFF', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}><Trash2 size={15} /> Delete Permanently</button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '11px 18px' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const UserManagement: React.FC<UserManagementProps> = ({ session }) => {
  const [users, setUsers]           = useState<AppUser[]>([]);
  const [searchQ, setSearchQ]       = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser]     = useState<AppUser | null>(null);
  const [deleteUser_, setDeleteUser]= useState<AppUser | null>(null);
  const [resetUser, setResetUser]   = useState<AppUser | null>(null);
  const [toast, setToast]           = useState<{msg: string; type: 'success'|'error'} | null>(null);

  const loadUsers = () => setUsers(getUsers());
  useEffect(() => { loadUsers(); }, []);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleStatus = (user: AppUser) => {
    const res = toggleUserStatus(user.id, session.userId);
    if (res.success) { loadUsers(); showToast(`${user.name} is now ${user.status === 'Active' ? 'Inactive' : 'Active'}.`); }
    else showToast(res.error ?? 'Failed.', 'error');
  };

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'All' || u.role === filterRole;
    const q = searchQ.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.designation ?? '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    byRole: Object.fromEntries((Object.keys(ROLE_META) as UserRole[]).map(r => [r, users.filter(u => u.role === r).length])),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, padding: '13px 18px', background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)', backdropFilter: 'blur(12px)', borderRadius: '12px', color: '#FFF', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '9px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showCreate && <UserFormModal mode="create" session={session} onSuccess={() => { loadUsers(); showToast('User created successfully!'); }} onClose={() => setShowCreate(false)} />}
      {editUser   && <UserFormModal mode="edit" user={editUser} session={session} onSuccess={() => { loadUsers(); showToast('User updated successfully!'); }} onClose={() => setEditUser(null)} />}
      {deleteUser_ && <DeleteConfirmModal user={deleteUser_} session={session} onSuccess={() => { loadUsers(); showToast('User deleted.'); }} onClose={() => setDeleteUser(null)} />}
      {resetUser   && <ResetPwdModal user={resetUser} onSuccess={() => { showToast('Password reset successfully!'); }} onClose={() => setResetUser(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,74,28,0.15)', border: '1px solid rgba(255,74,28,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#FF4A1C" />
            </div>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>User Management</h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px', marginLeft: '48px' }}>Create, manage, and configure user accounts and role-based access.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadUsers} className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: '0.82rem' }}><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}><UserPlus size={16} /> Create User</button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Users', value: stats.total, color: '#FFF', icon: <Users size={16} color="#94A3B8" /> },
          { label: 'Active Users', value: stats.active, color: '#10B981', icon: <Activity size={16} color="#10B981" /> },
          ...(Object.keys(ROLE_META) as UserRole[]).map(r => ({
            label: ROLE_META[r].label, value: stats.byRole[r] ?? 0, color: ROLE_META[r].color,
            icon: <ShieldCheck size={16} color={ROLE_META[r].color} />
          })),
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="glass-panel" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{label.toUpperCase()}</span>
              {icon}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color, marginTop: '4px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search by name, email, designation..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="form-input" style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['All', ...Object.keys(ROLE_META)] as Array<'All' | UserRole>).map(r => {
              const meta = r === 'All' ? null : ROLE_META[r];
              return (
                <button key={r} onClick={() => setFilterRole(r)} style={{
                  padding: '5px 12px', borderRadius: '7px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  background: filterRole === r ? (meta?.bg ?? 'rgba(255,74,28,0.12)') : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filterRole === r ? (meta?.border ?? 'rgba(255,74,28,0.35)') : 'rgba(255,255,255,0.1)'}`,
                  color: filterRole === r ? (meta?.color ?? '#FF4A1C') : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}>
                  {r === 'All' ? 'All Roles' : meta?.label}
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} of {users.length} users</span>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '10px 10px' }}>User</th>
                <th style={{ padding: '10px 10px' }}>Role</th>
                <th style={{ padding: '10px 10px' }}>Plant / Details</th>
                <th style={{ padding: '10px 10px' }}>Status</th>
                <th style={{ padding: '10px 10px' }}>Last Login</th>
                <th style={{ padding: '10px 10px', textAlign: 'center', minWidth: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No users found.</td></tr>
              ) : filtered.map(u => {
                const meta = ROLE_META[u.role];
                const isMe = u.id === session.userId;
                return (
                  <tr key={u.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* User */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: meta.color, flexShrink: 0 }}>
                          {u.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {u.name} {isMe && <span style={{ fontSize: '0.6rem', background: 'rgba(255,74,28,0.2)', color: '#FF4A1C', border: '1px solid rgba(255,74,28,0.35)', borderRadius: '4px', padding: '1px 5px', fontWeight: 700 }}>YOU</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{u.email}</div>
                          {u.phone && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}><Phone size={10} />{u.phone}</div>}
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '6px', fontSize: '0.73rem', fontWeight: 700, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>{meta.label}</span>
                      {u.designation && <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '3px' }}>{u.designation}</div>}
                    </td>
                    {/* Plant */}
                    <td style={{ padding: '12px 10px' }}>
                      {u.plant ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#10B981' }}>
                          <Building2 size={12} />{u.plant.split('—')[0]?.trim()}
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>}
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} /> Created {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, background: u.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)', color: u.status === 'Active' ? '#10B981' : '#64748B', border: `1px solid ${u.status === 'Active' ? 'rgba(16,185,129,0.35)' : 'rgba(100,116,139,0.25)'}` }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Active' ? '#10B981' : '#64748B' }} />
                        {u.status}
                      </span>
                    </td>
                    {/* Last Login */}
                    <td style={{ padding: '12px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : <span style={{ color: 'var(--text-muted)' }}>Never</span>}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Edit', icon: <Pencil size={13} />, color: '#FFA000', bg: 'rgba(255,160,0,0.1)', border: 'rgba(255,160,0,0.3)', action: () => setEditUser(u) },
                          { label: u.status === 'Active' ? 'Disable' : 'Enable', icon: u.status === 'Active' ? <ToggleLeft size={13} /> : <ToggleRight size={13} />, color: u.status === 'Active' ? '#64748B' : '#10B981', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', action: () => handleToggleStatus(u), disabled: isMe },
                          { label: 'Pwd', icon: <Lock size={13} />, color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', action: () => setResetUser(u) },
                          { label: 'Delete', icon: <Trash2 size={13} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', action: () => setDeleteUser(u), disabled: isMe },
                        ].map(({ label, icon, color, bg, border, action, disabled }) => (
                          <button key={label} onClick={disabled ? undefined : action} title={label}
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                              background: disabled ? 'rgba(255,255,255,0.03)' : bg, border: `1px solid ${disabled ? 'rgba(255,255,255,0.07)' : border}`,
                              borderRadius: '7px', padding: '5px 8px', cursor: disabled ? 'not-allowed' : 'pointer',
                              color: disabled ? '#3d4c60' : color, fontSize: '0.58rem', fontWeight: 700, fontFamily: 'inherit',
                              minWidth: '38px', transition: 'all 0.18s ease', opacity: disabled ? 0.4 : 1,
                            }}
                            onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                          >
                            {icon}<span style={{ lineHeight: 1 }}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
