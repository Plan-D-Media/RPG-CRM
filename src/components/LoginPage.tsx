import React, { useState } from 'react';
import { login, ROLE_META } from '../services/authService';
import { AuthSession } from '../types/auth';
import { Eye, EyeOff, LogIn, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (session: AuthSession) => void;
}

const DEMO_CREDS = [
  { role: 'Admin' as const,    email: 'admin@tooyumm.com',   password: 'Admin@2026' },
  { role: 'Customer' as const, email: 'cs@tooyumm.com',      password: 'Customer@2026' },
  { role: 'Plant' as const,    email: 'plantqa@tooyumm.com', password: 'PlantQA@2026' },
  { role: 'CQA' as const,      email: 'cqa@tooyumm.com',     password: 'CQA@2026' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    // Simulate async
    await new Promise(r => setTimeout(r, 600));
    const result = login(email.trim(), password);
    setLoading(false);
    if (result.success && result.session) {
      onLogin(result.session);
    } else {
      setError(result.error ?? 'Login failed. Please try again.');
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    const result = login(email, password);
    if (result.success && result.session) onLogin(result.session);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      backgroundImage: `
        radial-gradient(circle at 15% 25%, rgba(255, 74, 28, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(255, 145, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 60%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animated background orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { w: 400, h: 400, l: '-80px', t: '-80px', color: 'rgba(255,74,28,0.06)' },
          { w: 300, h: 300, r: '-60px', b: '10%',   color: 'rgba(255,145,0,0.05)' },
          { w: 200, h: 200, l: '30%',   b: '-50px',  color: 'rgba(16,185,129,0.04)' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', width: orb.w, height: orb.h,
            left: (orb as any).l, right: (orb as any).r,
            top: (orb as any).t, bottom: (orb as any).b,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: `float${i} ${6 + i * 2}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '1060px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 80px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,74,28,0.2)', position: 'relative' }}>

        {/* ── LEFT PANEL — Brand showcase ── */}
        <div style={{
          background: 'linear-gradient(145deg, #1a0a00 0%, #2d1200 35%, #1a0800 70%, #0d0400 100%)',
          padding: '52px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,74,28,0.2)',
        }}>
          {/* Glow effects */}
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(255,74,28,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,145,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Top: Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '8px 12px',
                boxShadow: '0 0 0 1px rgba(255,74,28,0.3), 0 8px 24px rgba(0,0,0,0.4), 0 0 40px rgba(255,74,28,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src="/rpg-logo.png" alt="RP-Sanjiv Goenka Group" style={{ height: '52px', width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1 }}>Too Yumm!</div>
                <div style={{ fontSize: '0.7rem', color: '#FF8C4A', fontWeight: 700, letterSpacing: '0.08em', marginTop: '3px' }}>QUALITY CRM 2.0</div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#FFF', lineHeight: 1.15, marginBottom: '14px' }}>
                Enterprise Quality<br />
                <span style={{ background: 'linear-gradient(135deg,#FF4A1C,#FF9100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Management Hub
                </span>
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                AI-powered CQMS platform for complaint management, plant QA, outbreak detection, and 8D CAPA across all Too Yumm! manufacturing facilities.
              </p>
            </div>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '🏭', text: 'Multi-plant quality tracking' },
                { icon: '🤖', text: 'AI Copilot & outbreak radar' },
                { icon: '📋', text: 'End-to-end 8D CAPA workflow' },
                { icon: '📊', text: 'Real-time analytics dashboard' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,74,28,0.15)', borderRadius: '10px', padding: '9px 14px' }}>
                  <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: tagline */}
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>Powered by</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>RP-Sanjiv Goenka Group · Guiltfree Industries Ltd</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>FSSAI: 10017031002079 · AI Quality System 2.0</div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Login form ── */}
        <div style={{
          background: 'rgba(11, 15, 25, 0.98)',
          padding: '52px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,74,28,0.15)', border: '1px solid rgba(255,74,28,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#FF4A1C" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>Sign In</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '46px' }}>Enter your credentials to access the CRM</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {error && (
              <div style={{ padding: '11px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', display: 'flex', gap: '9px', alignItems: 'center', color: '#FCA5A5', fontSize: '0.82rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@tooyumm.com"
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '10px', color: '#F8FAFC', padding: '12px 14px', fontFamily: 'inherit',
                  fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s ease', height: '46px',
                }}
                onFocus={e => { e.target.style.borderColor = '#FF4A1C'; e.target.style.boxShadow = '0 0 0 3px rgba(255,74,28,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.14)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••"
                  required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: '10px', color: '#F8FAFC', padding: '12px 44px 12px 14px', fontFamily: 'inherit',
                    fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s ease', height: '46px',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#FF4A1C'; e.target.style.boxShadow = '0 0 0 3px rgba(255,74,28,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.14)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '2px' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', marginTop: '4px',
                background: loading ? 'rgba(255,74,28,0.4)' : 'linear-gradient(135deg,#FF3D00 0%,#FF6D00 60%,#FF9100 100%)',
                border: 'none', borderRadius: '10px', color: '#FFF', fontFamily: 'inherit',
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 6px 22px rgba(255,74,28,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing In...</>
              ) : (
                <><LogIn size={18} /> Sign In to CRM</>
              )}
            </button>
          </form>

          {/* Quick Access */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>QUICK DEMO ACCESS</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {DEMO_CREDS.map(({ role, email, password }) => {
                const meta = ROLE_META[role];
                return (
                  <button
                    key={role}
                    onClick={() => quickLogin(email, password)}
                    style={{
                      background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: '10px',
                      padding: '9px 12px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: meta.color }}>{meta.label}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{email}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} color="var(--brand-accent)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Secured by AI Quality System 2.0 · RP-Sanjiv Goenka Group</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float0 { from { transform: translate(0,0) scale(1); } to { transform: translate(20px,30px) scale(1.1); } }
        @keyframes float1 { from { transform: translate(0,0); } to { transform: translate(-15px,20px); } }
        @keyframes float2 { from { transform: translate(0,0); } to { transform: translate(10px,-20px); } }
      `}</style>
    </div>
  );
};
