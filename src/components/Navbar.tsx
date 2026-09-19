import React, { useState } from 'react';
import { AuthSession } from '../types/auth';
import { ROLE_META } from '../services/authService';
import {
  ShieldAlert,
  Sparkles,
  Building2,
  Users,
  Search,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react';

interface NavbarProps {
  session: AuthSession;
  onOpenCopilot: () => void;
  activeOutbreaksCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenCopilot,
  activeOutbreaksCount,
  searchQuery,
  setSearchQuery,
  onLogout,
  onNavigateAdmin,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const meta = ROLE_META[session.role];

  const initials = session.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  return (
    <header
      style={{
        background: 'rgba(8, 10, 18, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,74,28,0.18)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div
        className="app-container"
        style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', height: '68px' }}
      >

        {/* ── Brand & Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {/* Logo container — prominent white card with brand glow */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '52px',
            minWidth: '72px',
            boxShadow: '0 0 0 1px rgba(255,74,28,0.4), 0 4px 16px rgba(0,0,0,0.5), 0 0 32px rgba(255,74,28,0.18)',
            transition: 'box-shadow 0.3s ease',
            flexShrink: 0,
          }}>
            <img
              src="/rpg-logo.png"
              alt="RP-Sanjiv Goenka Group"
              style={{ height: '38px', width: 'auto', objectFit: 'contain', display: 'block' }}
              onError={e => {
                // Fallback if image not found
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.parentElement as HTMLElement).innerHTML =
                  '<span style="font-family:serif;font-size:1.1rem;font-weight:900;color:#FF4A1C;letter-spacing:-0.04em;">RPSG</span>';
              }}
            />
          </div>

          {/* Brand text */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="font-display"
                style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFF', lineHeight: 1 }}
              >
                Too Yumm!
              </span>
              <span style={{
                background: 'linear-gradient(135deg,#FF3D00,#FF6D00)',
                fontSize: '0.6rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '5px',
                color: '#FFF',
                letterSpacing: '0.06em',
                boxShadow: '0 2px 8px rgba(255,74,28,0.4)',
              }}>
                RPSG QUALITY
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px', letterSpacing: '0.01em' }}>
              <span style={{ color: '#FF6D00', fontWeight: 700 }}>AI Quality & CQMS 2.0</span>
              <span style={{ margin: '0 5px' }}>·</span>
              <span>RP-Sanjiv Goenka Group</span>
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search Batch #, City, Ticket..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.83rem', borderRadius: '10px' }}
          />
        </div>

        {/* ── Right: AI Copilot + User Profile ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>

          {/* AI Copilot button */}
          <button
            onClick={onOpenCopilot}
            className="btn"
            style={{
              background: 'linear-gradient(135deg,rgba(255,61,0,0.18) 0%,rgba(255,109,0,0.12) 100%)',
              border: '1px solid rgba(255,74,28,0.45)',
              color: '#FFF',
              padding: '8px 16px',
              fontSize: '0.82rem',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(255,74,28,0.15)',
            }}
          >
            <Sparkles size={15} color="#FFA000" />
            <span style={{ fontWeight: 700 }}>AI Copilot</span>
            <span style={{ background: 'linear-gradient(135deg,#FF3D00,#FF6D00)', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>PRO</span>
          </button>

          {/* Outbreak indicator */}
          {activeOutbreaksCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', animation: 'pulseGlow 2s infinite' }}>
              <ShieldAlert size={13} color="#EF4444" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#EF4444' }}>{activeOutbreaksCount} Alert{activeOutbreaksCount > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${profileOpen ? meta.border : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '12px',
                padding: '6px 12px 6px 7px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: meta.bg, border: `2px solid ${meta.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.75rem', color: meta.color, flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', lineHeight: 1.2 }}>{session.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.65rem', color: meta.color, fontWeight: 600 }}>{meta.label}</div>
              </div>
              <ChevronDown size={14} color="#64748B" style={{ transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'rgba(11,15,25,0.98)', backdropFilter: 'blur(16px)',
                border: `1px solid ${meta.border}`, borderRadius: '14px',
                minWidth: '220px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                overflow: 'hidden', zIndex: 200,
              }}>
                {/* Profile info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: `${meta.bg}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: meta.bg, border: `2px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: meta.color }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.87rem' }}>{session.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{session.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '5px', background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, fontWeight: 700 }}>{meta.label}</span>
                    {session.plant && <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '5px', background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>🏭 {session.plant.split('—')[0]?.trim()}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '6px' }}>
                  {session.role === 'Admin' && onNavigateAdmin && (
                    <button
                      onClick={() => { onNavigateAdmin(); setProfileOpen(false); }}
                      style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '9px', color: '#FF4A1C', fontSize: '0.82rem', fontWeight: 600, transition: 'background 0.15s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,74,28,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <Users size={15} /> User Management
                    </button>
                  )}
                  <button
                    onClick={() => { setProfileOpen(false); }}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '9px', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, transition: 'background 0.15s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <User size={15} /> My Profile
                  </button>
                </div>

                <div style={{ padding: '6px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={() => { onLogout(); setProfileOpen(false); }}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '9px', color: '#EF4444', fontSize: '0.82rem', fontWeight: 600, transition: 'background 0.15s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
