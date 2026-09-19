import React, { useState } from 'react';
import { NavigationPage, MasterCategoryType } from '../types/crmExtended';
import { UserRole } from '../types/auth';
import { ALLOWED_PAGES, getPermissions } from '../services/permissions';
import {
  Gauge,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ListOrdered,
  Wrench,
  ShieldAlert,
  Sparkles,
  Users,
  Lock,
} from 'lucide-react';
import { ROLE_META } from '../services/authService';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  selectedMasterCategory: MasterCategoryType;
  onSelectMasterCategory: (cat: MasterCategoryType) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  selectedMasterCategory,
  onSelectMasterCategory,
  userRole,
}) => {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isInternalOpen, setIsInternalOpen] = useState(false);

  const allowed = ALLOWED_PAGES[userRole] as string[];
  const perms = getPermissions(userRole);
  const canSee = (page: string) => allowed.includes(page);
  const meta = ROLE_META[userRole];

  const masterCategories: MasterCategoryType[] = [
    'Region', 'Complaint Source', 'Product Category', 'Product Name',
    'Product Flavour', 'Plant Name', 'Response', 'Complaint Category',
    'Complaint Sub Category', 'Complaint Status',
  ];

  // Shared nav-item style
  const navItemStyle = (isActive: boolean, activeBg: string, activeColor: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? activeBg : 'transparent',
    color: isActive ? activeColor : 'var(--text-main)',
    fontWeight: 600,
    fontSize: '0.9rem',
    textAlign: 'left' as const,
    transition: 'all 0.18s ease',
    fontFamily: 'inherit',
    marginBottom: '3px',
  });

  // Show breakdown accordion only if user has at least one breakdown page
  const showBreakdown = canSee('Add_Breakdown') || canSee('View_All_Breakdown');
  const showInternal = canSee('Add_Internal_Complaint') || canSee('View_All_Internal_Complaint');
  const showMasters = canSee('Masters');

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 21, 37, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255,74,28,0.12)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px',
      overflowY: 'auto',
      zIndex: 50,
    }}>

      {/* Role Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '8px 12px', marginBottom: '14px', borderRadius: '10px',
        background: meta.bg, border: `1px solid ${meta.border}`,
      }}>
        <Lock size={13} color={meta.color} />
        <div>
          <div style={{ fontSize: '0.68rem', color: meta.color, fontWeight: 700, letterSpacing: '0.05em' }}>{meta.label.toUpperCase()} ACCESS</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{meta.desc}</div>
        </div>
      </div>

      {/* Dashboard */}
      {canSee('Dashboard') && (
        <button
          onClick={() => onNavigate('Dashboard')}
          style={{
            ...navItemStyle(currentPage === 'Dashboard', 'linear-gradient(135deg,#FF3D00,#FF6D00)', '#FFF'),
            fontWeight: 700,
            fontSize: '0.95rem',
            marginBottom: '14px',
            boxShadow: currentPage === 'Dashboard' ? '0 4px 14px rgba(255,74,28,0.35)' : 'none',
          }}
        >
          <Gauge size={19} color={currentPage === 'Dashboard' ? '#FFF' : '#FF6D00'} />
          <span>Dashboard</span>
        </button>
      )}

      {/* Section header */}
      <div style={{
        fontSize: '0.68rem', fontWeight: 800, color: '#FF6D00',
        letterSpacing: '0.08em', padding: '6px 14px', marginBottom: '6px',
      }}>
        INTERFACE
      </div>

      {/* Masters Accordion */}
      {showMasters && (
        <div style={{ marginBottom: '6px' }}>
          <button
            onClick={() => setIsMastersOpen(!isMastersOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: currentPage === 'Masters' ? 'rgba(255,74,28,0.15)' : 'transparent',
              color: currentPage === 'Masters' ? '#FF6D00' : 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={18} color="#FF6D00" />
              <span>Masters</span>
              {!perms.masters_add && <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontWeight: 700 }}>READ</span>}
            </div>
            {isMastersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isMastersOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px', borderLeft: '2px solid rgba(255,74,28,0.2)', marginLeft: '14px' }}>
              {masterCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { onSelectMasterCategory(cat); onNavigate('Masters'); }}
                  style={{
                    textAlign: 'left',
                    background: (currentPage === 'Masters' && selectedMasterCategory === cat) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: (currentPage === 'Masters' && selectedMasterCategory === cat) ? '#FFA000' : 'var(--text-secondary)',
                    border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                    fontWeight: (currentPage === 'Masters' && selectedMasterCategory === cat) ? 700 : 500,
                    transition: 'color 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Complaint */}
      {canSee('Add_Complaint') && (
        <button onClick={() => onNavigate('Add_Complaint')} style={navItemStyle(currentPage === 'Add_Complaint', 'rgba(168,85,247,0.2)', '#C084FC')}>
          <PlusCircle size={18} color="#A855F7" />
          <span>Add Complaint</span>
        </button>
      )}

      {/* View All Complaint */}
      {canSee('View_All_Complaint') && (
        <button onClick={() => onNavigate('View_All_Complaint')} style={{ ...navItemStyle(currentPage === 'View_All_Complaint', 'rgba(168,85,247,0.2)', '#C084FC'), marginBottom: '6px' }}>
          <ListOrdered size={18} color="#A855F7" />
          <span>View All Complaint</span>
          {!perms.complaint_edit && <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontWeight: 700, marginLeft: 'auto' }}>VIEW</span>}
        </button>
      )}

      {/* Breakdown Accordion */}
      {showBreakdown && (
        <div style={{ marginBottom: '6px' }}>
          <button
            onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: (currentPage === 'Add_Breakdown' || currentPage === 'View_All_Breakdown') ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: (currentPage === 'Add_Breakdown' || currentPage === 'View_All_Breakdown') ? '#60A5FA' : 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wrench size={18} color="#3B82F6" />
              <span>Breakdown Log Sheet</span>
            </div>
            {isBreakdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isBreakdownOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px', borderLeft: '2px solid rgba(59,130,246,0.3)', marginLeft: '14px' }}>
              {canSee('Add_Breakdown') && (
                <button onClick={() => onNavigate('Add_Breakdown')} style={{ textAlign: 'left', background: currentPage === 'Add_Breakdown' ? 'rgba(255,255,255,0.1)' : 'transparent', color: currentPage === 'Add_Breakdown' ? '#93C5FD' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Add New Breakdown
                </button>
              )}
              {canSee('View_All_Breakdown') && (
                <button onClick={() => onNavigate('View_All_Breakdown')} style={{ textAlign: 'left', background: currentPage === 'View_All_Breakdown' ? 'rgba(255,255,255,0.1)' : 'transparent', color: currentPage === 'View_All_Breakdown' ? '#93C5FD' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  View All Breakdown
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Internal Complaint Accordion */}
      {showInternal && (
        <div style={{ marginBottom: '6px' }}>
          <button
            onClick={() => setIsInternalOpen(!isInternalOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: (currentPage === 'Add_Internal_Complaint' || currentPage === 'View_All_Internal_Complaint') ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: (currentPage === 'Add_Internal_Complaint' || currentPage === 'View_All_Internal_Complaint') ? '#34D399' : 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} color="#10B981" />
              <span>Internal Complaint</span>
            </div>
            {isInternalOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isInternalOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px', borderLeft: '2px solid rgba(16,185,129,0.3)', marginLeft: '14px' }}>
              {canSee('Add_Internal_Complaint') && (
                <button onClick={() => onNavigate('Add_Internal_Complaint')} style={{ textAlign: 'left', background: currentPage === 'Add_Internal_Complaint' ? 'rgba(255,255,255,0.1)' : 'transparent', color: currentPage === 'Add_Internal_Complaint' ? '#6EE7B7' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Add New Complaint
                </button>
              )}
              {canSee('View_All_Internal_Complaint') && (
                <button onClick={() => onNavigate('View_All_Internal_Complaint')} style={{ textAlign: 'left', background: currentPage === 'View_All_Internal_Complaint' ? 'rgba(255,255,255,0.1)' : 'transparent', color: currentPage === 'View_All_Internal_Complaint' ? '#6EE7B7' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  View All complaint
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Admin: User Management */}
      {perms.user_management && (
        <button onClick={() => onNavigate('User_Management' as NavigationPage)} style={{ ...navItemStyle((currentPage as string) === 'User_Management', 'rgba(255,74,28,0.18)', '#FF6D00'), marginTop: '4px' }}>
          <Users size={18} color="#FF4A1C" />
          <span>User Management</span>
        </button>
      )}

      {/* Bottom AI Badge */}
      <div style={{
        marginTop: 'auto',
        background: 'linear-gradient(135deg, rgba(255,74,28,0.12) 0%, rgba(255,109,0,0.08) 100%)',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid rgba(255,74,28,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={16} color="#FFA000" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>AI Assistant Active</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          Real-time packet OCR, 8D CAPA, and Outbreak Radar enabled.
        </p>
      </div>

    </aside>
  );
};
