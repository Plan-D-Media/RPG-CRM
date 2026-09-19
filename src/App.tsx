import React, { useState, useMemo, useEffect } from 'react';
import { ComplaintTicket, OutbreakAlert } from './types/crm';
import { UserRole } from './types/auth';
import { NavigationPage, MasterCategoryType, MasterItem, BreakdownLog, InternalComplaint } from './types/crmExtended';
import { AuthSession } from './types/auth';
import { getSession, logout } from './services/authService';
import { getPermissions, canAccessPage } from './services/permissions';
import { INITIAL_COMPLAINTS, ACTIVE_OUTBREAKS } from './data/crmData';
import { INITIAL_MASTERS, INITIAL_BREAKDOWNS, INITIAL_INTERNAL_COMPLAINTS } from './data/masterData';

import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardCharts } from './components/DashboardCharts';
import { CustomerPortal } from './components/CustomerPortal';
import { ComplaintsListView } from './components/ComplaintsListView';
import { PlantPortal } from './components/PlantPortal';
import { CQAPortal } from './components/CQAPortal';
import { BreakdownLogView } from './components/BreakdownLogView';
import { InternalComplaintsView } from './components/InternalComplaintsView';
import { MastersView } from './components/MastersView';
import { UserManagement } from './components/UserManagement';
import { AICopilotModal } from './components/AICopilotModal';
import { ComplaintDetailsModal } from './components/ComplaintDetailsModal';

// Derive a default page from session role
const defaultPageForRole = (role: UserRole): NavigationPage => {
  if (role === 'Customer') return 'Add_Complaint';
  if (role === 'Plant')    return 'View_All_Breakdown';
  return 'Dashboard';
};

export const App: React.FC = () => {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [session, setSession] = useState<AuthSession | null>(() => getSession());

  const handleLogin = (s: AuthSession) => {
    setSession(s);
    setCurrentPage(defaultPageForRole(s.role));
  };

  const handleLogout = () => {
    logout();
    setSession(null);
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState<NavigationPage>(() => {
    const s = getSession();
    return s ? defaultPageForRole(s.role) : 'Dashboard';
  });
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<MasterCategoryType>('Plant Name');

  useEffect(() => {
    if (session) setCurrentPage(defaultPageForRole(session.role));
  }, [session?.role]);

  // ── RBAC permissions for current role ────────────────────────────────────────
  const perms = session ? getPermissions(session.role) : null;

  // Guarded navigate — prevent navigation to forbidden pages
  const handleNavigate = (page: NavigationPage) => {
    if (!session) return;
    if (canAccessPage(session.role, page)) {
      setCurrentPage(page);
    }
  };

  // ── Core Data ───────────────────────────────────────────────────────────────
  const [complaints,         setComplaints]         = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [outbreaks]                                 = useState<OutbreakAlert[]>(ACTIVE_OUTBREAKS);
  const [masters,            setMasters]            = useState<MasterItem[]>(INITIAL_MASTERS);
  const [breakdowns,         setBreakdowns]         = useState<BreakdownLog[]>(INITIAL_BREAKDOWNS);
  const [internalComplaints, setInternalComplaints] = useState<InternalComplaint[]>(INITIAL_INTERNAL_COMPLAINTS);

  // ── Search & Modal ──────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState('');
  const [isCopilotOpen,    setIsCopilotOpen]    = useState(false);
  const [inspectingTicket, setInspectingTicket] = useState<ComplaintTicket | null>(null);

  const filteredComplaints = useMemo(() => {
    if (!searchQuery.trim()) return complaints;
    const q = searchQuery.toLowerCase();
    return complaints.filter(c =>
      c.batchNumber.toLowerCase().includes(q) ||
      c.consumerCity.toLowerCase().includes(q) ||
      c.consumerName.toLowerCase().includes(q) ||
      c.ticketNumber.toLowerCase().includes(q) ||
      c.product.name.toLowerCase().includes(q) ||
      c.plantCode.toLowerCase().includes(q)
    );
  }, [complaints, searchQuery]);

  // ── Handlers (only called if permissions allow) ──────────────────────────────
  const handleAddComplaint    = (t: ComplaintTicket)  => { if (perms?.complaint_add) setComplaints(p => [t, ...p]); };
  const handleUpdateComplaint = (t: ComplaintTicket)  => { if (perms?.complaint_edit) setComplaints(p => p.map(c => c.id === t.id ? t : c)); };
  const handleDeleteComplaint = (id: string)          => { if (perms?.complaint_delete) setComplaints(p => p.filter(c => c.id !== id)); };

  const handleAddMasterItem    = (m: MasterItem) => { if (perms?.masters_add) setMasters(p => [m, ...p]); };
  const handleDeleteMasterItem = (id: string)    => { if (perms?.masters_delete) setMasters(p => p.filter(m => m.id !== id)); };

  const handleAddBreakdown    = (b: BreakdownLog) => { if (perms?.breakdown_add) setBreakdowns(p => [b, ...p]); };
  const handleUpdateBreakdown = (b: BreakdownLog) => { if (perms?.breakdown_edit) setBreakdowns(p => p.map(x => x.id === b.id ? b : x)); };
  const handleDeleteBreakdown = (id: string)      => { if (perms?.breakdown_delete) setBreakdowns(p => p.filter(x => x.id !== id)); };

  const handleAddInternalComplaint    = (c: InternalComplaint) => { if (perms?.internal_add) setInternalComplaints(p => [c, ...p]); };
  const handleUpdateInternalComplaint = (c: InternalComplaint) => { if (perms?.internal_edit) setInternalComplaints(p => p.map(x => x.id === c.id ? c : x)); };
  const handleDeleteInternalComplaint = (id: string)           => { if (perms?.internal_delete) setInternalComplaints(p => p.filter(x => x.id !== id)); };

  // ── No-op stubs for read-only usage ──────────────────────────────────────────
  const noop = () => {};
  const noopTicket = (_t: ComplaintTicket) => {};
  const noopId = (_id: string) => {};
  const noopBreakdown = (_b: BreakdownLog) => {};
  const noopInternal = (_c: InternalComplaint) => {};
  const noopMaster = (_m: MasterItem) => {};

  // ── Gate: show login if no session ──────────────────────────────────────────
  if (!session || !perms) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header */}
      <Navbar
        session={session}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        activeOutbreaksCount={outbreaks.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
        onNavigateAdmin={perms.user_management ? () => setCurrentPage('User_Management' as NavigationPage) : undefined}
      />

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1 }}>

        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          selectedMasterCategory={selectedMasterCategory}
          onSelectMasterCategory={cat => setSelectedMasterCategory(cat)}
          userRole={session.role}
        />

        <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>

          {/* 1. Dashboard (Admin, Plant, CQA) */}
          {currentPage === 'Dashboard' && perms.dashboard_view && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <DashboardCharts
                onNewComplaintClick={perms.complaint_add ? () => setCurrentPage('Add_Complaint') : noop}
                complaints={filteredComplaints}
              />
              <CQAPortal
                complaints={filteredComplaints}
                outbreaks={outbreaks}
                onUpdateComplaint={perms.complaint_edit ? handleUpdateComplaint : noopTicket}
                onViewDetails={ticket => setInspectingTicket(ticket)}
              />
            </div>
          )}

          {/* 2. Add Complaint (Admin, Customer) */}
          {currentPage === 'Add_Complaint' && perms.complaint_add && (
            <CustomerPortal
              complaints={filteredComplaints}
              onAddComplaint={handleAddComplaint}
              onViewDetails={ticket => setInspectingTicket(ticket)}
            />
          )}

          {/* 3. View All Complaints (all roles see, but different actions) */}
          {currentPage === 'View_All_Complaint' && (
            <ComplaintsListView
              complaints={filteredComplaints}
              onViewDetails={ticket => setInspectingTicket(ticket)}
              onNewComplaintClick={perms.complaint_add ? () => setCurrentPage('Add_Complaint') : noop}
              onAddComplaint={perms.complaint_add ? handleAddComplaint : noopTicket}
              onUpdateComplaint={perms.complaint_edit ? handleUpdateComplaint : noopTicket}
              onDeleteComplaint={perms.complaint_delete ? handleDeleteComplaint : noopId}
              permissions={perms}
            />
          )}

          {/* 4. Breakdown — Add (Admin, Plant) */}
          {currentPage === 'Add_Breakdown' && perms.breakdown_add && (
            <BreakdownLogView
              breakdowns={breakdowns}
              onAddBreakdown={handleAddBreakdown}
              onUpdateBreakdown={perms.breakdown_edit ? handleUpdateBreakdown : noopBreakdown}
              onDeleteBreakdown={perms.breakdown_delete ? handleDeleteBreakdown : noopId}
              initialMode="add"
              permissions={perms}
            />
          )}

          {/* 5. Breakdown — View */}
          {currentPage === 'View_All_Breakdown' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <BreakdownLogView
                breakdowns={breakdowns}
                onAddBreakdown={perms.breakdown_add ? handleAddBreakdown : noopBreakdown}
                onUpdateBreakdown={perms.breakdown_edit ? handleUpdateBreakdown : noopBreakdown}
                onDeleteBreakdown={perms.breakdown_delete ? handleDeleteBreakdown : noopId}
                initialMode="view"
                permissions={perms}
              />
              <PlantPortal
                complaints={filteredComplaints}
                onUpdateComplaint={perms.complaint_edit ? handleUpdateComplaint : noopTicket}
                onViewDetails={ticket => setInspectingTicket(ticket)}
              />
            </div>
          )}

          {/* 6. Internal Complaint — Add (Admin, Plant) */}
          {currentPage === 'Add_Internal_Complaint' && perms.internal_add && (
            <InternalComplaintsView
              complaints={internalComplaints}
              onAddInternalComplaint={handleAddInternalComplaint}
              onUpdateInternalComplaint={perms.internal_edit ? handleUpdateInternalComplaint : noopInternal}
              onDeleteInternalComplaint={perms.internal_delete ? handleDeleteInternalComplaint : noopId}
              initialMode="add"
              permissions={perms}
            />
          )}

          {/* 7. Internal Complaint — View */}
          {currentPage === 'View_All_Internal_Complaint' && (
            <InternalComplaintsView
              complaints={internalComplaints}
              onAddInternalComplaint={perms.internal_add ? handleAddInternalComplaint : noopInternal}
              onUpdateInternalComplaint={perms.internal_edit ? handleUpdateInternalComplaint : noopInternal}
              onDeleteInternalComplaint={perms.internal_delete ? handleDeleteInternalComplaint : noopId}
              initialMode="view"
              permissions={perms}
            />
          )}

          {/* 8. Masters (Admin: full CRUD, CQA: read-only) */}
          {currentPage === 'Masters' && perms.masters_view && (
            <MastersView
              masters={masters}
              selectedCategory={selectedMasterCategory}
              onSelectCategory={cat => setSelectedMasterCategory(cat)}
              onAddMasterItem={perms.masters_add ? handleAddMasterItem : noopMaster}
              onDeleteMasterItem={perms.masters_delete ? handleDeleteMasterItem : noopId}
              permissions={perms}
            />
          )}

          {/* 9. User Management (Admin only) */}
          {(currentPage as string) === 'User_Management' && perms.user_management && (
            <UserManagement session={session} />
          )}

          {/* Access Denied fallback */}
          {!canAccessPage(session.role, currentPage) && (currentPage as string) !== 'User_Management' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                🔒
              </div>
              <h2 className="font-display" style={{ fontSize: '1.4rem', color: '#FFF' }}>Access Restricted</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Your <strong style={{ color: '#FF6D00' }}>{session.role}</strong> role does not have permission to view this page.
                Contact your administrator for access.
              </p>
              <button onClick={() => setCurrentPage(defaultPageForRole(session.role))} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 24px' }}>
                ← Go to Home
              </button>
            </div>
          )}

        </main>
      </div>

      {/* AI Copilot */}
      <AICopilotModal isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} complaints={complaints} />

      {/* Ticket Detail Modal */}
      <ComplaintDetailsModal ticket={inspectingTicket} onClose={() => setInspectingTicket(null)} />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,74,28,0.12)', background: 'rgba(8,10,18,0.99)', padding: '14px 24px', zIndex: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#FFF', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <img src="/rpg-logo.png" alt="RPSG" style={{ height: '22px', objectFit: 'contain' }} />
            </div>
            <strong style={{ color: '#FFF' }}>TOO YUMM!® CRM</strong> • Copyright © 2026 • RP-Sanjiv Goenka Group
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span>Guiltfree Industries Limited</span><span>•</span>
            <span>FSSAI: 10017031002079</span><span>•</span>
            <span style={{ color: '#FF6D00', fontWeight: 700 }}>AI Quality System 2.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
