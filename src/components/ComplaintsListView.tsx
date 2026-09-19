import React, { useState } from 'react';
import { ComplaintTicket } from '../types/crm';
import { AddComplaintForm } from './AddComplaintForm';
import { EditComplaintModal, AssignModal, DeleteConfirmModal, ReportModal } from './ComplaintActionModals';
import {
  Search,
  ArrowRight,
  Download,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  FileText,
} from 'lucide-react';

interface ComplaintsListViewProps {
  complaints: ComplaintTicket[];
  onViewDetails: (ticket: ComplaintTicket) => void;
  onNewComplaintClick: () => void;
  onAddComplaint: (ticket: ComplaintTicket) => void;
  onUpdateComplaint: (ticket: ComplaintTicket) => void;
  onDeleteComplaint: (id: string) => void;
}

export const ComplaintsListView: React.FC<ComplaintsListViewProps> = ({
  complaints,
  onViewDetails,
  onNewComplaintClick,
  onAddComplaint,
  onUpdateComplaint,
  onDeleteComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Active modal state
  const [editTicket, setEditTicket] = useState<ComplaintTicket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<ComplaintTicket | null>(null);
  const [assignTicket, setAssignTicket] = useState<ComplaintTicket | null>(null);
  const [assignL1Ticket, setAssignL1Ticket] = useState<ComplaintTicket | null>(null);
  const [reportTicket, setReportTicket] = useState<ComplaintTicket | null>(null);

  const filtered = complaints.filter(c => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.consumerCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plantCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || c.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // ── Action button config ─────────────────────────────────────────────────
  const getActions = (ticket: ComplaintTicket) => [
    {
      key: 'view',
      label: 'View',
      icon: <Eye size={14} />,
      color: '#38BDF8',
      bg: 'rgba(56,189,248,0.12)',
      border: 'rgba(56,189,248,0.35)',
      onClick: () => onViewDetails(ticket),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <Pencil size={14} />,
      color: '#FFA000',
      bg: 'rgba(255,160,0,0.12)',
      border: 'rgba(255,160,0,0.35)',
      onClick: () => setEditTicket(ticket),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 size={14} />,
      color: '#EF4444',
      bg: 'rgba(239,68,68,0.12)',
      border: 'rgba(239,68,68,0.35)',
      onClick: () => setDeleteTicket(ticket),
    },
    {
      key: 'assign',
      label: 'Assign',
      icon: <UserPlus size={14} />,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.35)',
      onClick: () => setAssignTicket(ticket),
    },
    {
      key: 'assignL1',
      label: 'Assign L1',
      icon: <Users size={14} />,
      color: '#A78BFA',
      bg: 'rgba(167,139,250,0.12)',
      border: 'rgba(167,139,250,0.35)',
      onClick: () => setAssignL1Ticket(ticket),
    },
    {
      key: 'report',
      label: 'Report',
      icon: <FileText size={14} />,
      color: '#FF4A1C',
      bg: 'rgba(255,74,28,0.12)',
      border: 'rgba(255,74,28,0.35)',
      onClick: () => setReportTicket(ticket),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Inline Add Form ── */}
      {showAddForm && (
        <AddComplaintForm
          onAddComplaint={(ticket) => { onAddComplaint(ticket); setShowAddForm(false); }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* ── Modals ── */}
      {editTicket && (
        <EditComplaintModal
          ticket={editTicket}
          onSave={(updated) => { onUpdateComplaint(updated); setEditTicket(null); }}
          onClose={() => setEditTicket(null)}
        />
      )}
      {deleteTicket && (
        <DeleteConfirmModal
          ticket={deleteTicket}
          onConfirm={() => { onDeleteComplaint(deleteTicket.id); setDeleteTicket(null); }}
          onClose={() => setDeleteTicket(null)}
        />
      )}
      {assignTicket && (
        <AssignModal
          ticket={assignTicket}
          mode="assign"
          onSave={(updated) => { onUpdateComplaint(updated); setAssignTicket(null); }}
          onClose={() => setAssignTicket(null)}
        />
      )}
      {assignL1Ticket && (
        <AssignModal
          ticket={assignL1Ticket}
          mode="assignL1"
          onSave={(updated) => { onUpdateComplaint(updated); setAssignL1Ticket(null); }}
          onClose={() => setAssignL1Ticket(null)}
        />
      )}
      {reportTicket && (
        <ReportModal ticket={reportTicket} onClose={() => setReportTicket(null)} />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            All Consumer Complaints Registry
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comprehensive directory of external consumer reports, plant assignments, AI triage diagnostics, and resolution status.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <PlusCircle size={16} />
          <span>+ Add New Complaint</span>
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search Ticket, Batch #, City, Consumer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select" style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}>
              <option value="All">All Statuses</option>
              <option value="Logged">Logged</option>
              <option value="AI_Triaged">AI Triaged</option>
              <option value="Plant_Investigation">Plant Investigation</option>
              <option value="CAPA_Generated">CAPA Generated</option>
              <option value="CQA_Reviewed">CQA Reviewed</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Severity:</span>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="form-select" style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}>
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
            {filtered.length} records
          </span>
        </div>
      </div>

      {/* ── Complaints Table ── */}
      <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Ticket #</th>
              <th style={{ padding: '12px 8px' }}>Product & Flavor</th>
              <th style={{ padding: '12px 8px' }}>Batch / Plant</th>
              <th style={{ padding: '12px 8px' }}>Consumer & Location</th>
              <th style={{ padding: '12px 8px' }}>Category</th>
              <th style={{ padding: '12px 8px' }}>Severity</th>
              <th style={{ padding: '12px 8px' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'center', minWidth: '260px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No complaints match your search / filter criteria.
                </td>
              </tr>
            ) : filtered.map(t => (
              <tr
                key={t.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', whiteSpace: 'nowrap' }}>
                  {t.ticketNumber}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ fontWeight: 600, color: '#FFF' }}>{t.product.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.product.flavor}</div>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>{t.batchNumber}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Plant: {t.plantCode}</div>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ color: '#FFF' }}>{t.consumerName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.consumerCity}, {t.consumerState}</div>
                </td>
                <td style={{ padding: '12px 8px', maxWidth: '180px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {t.category}
                  </div>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span className={`badge badge-${t.severity.toLowerCase()}`}>{t.severity}</span>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span className="badge badge-info">{t.status.replace(/_/g, ' ')}</span>
                </td>

                {/* ── Action Buttons ── */}
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'nowrap' }}>
                    {getActions(t).map(({ key, label, icon, color, bg, border, onClick }) => (
                      <button
                        key={key}
                        onClick={onClick}
                        title={label}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          background: bg,
                          border: `1px solid ${border}`,
                          borderRadius: '7px',
                          padding: '5px 7px',
                          cursor: 'pointer',
                          color,
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-sans)',
                          minWidth: '38px',
                          transition: 'all 0.18s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${border}`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                      >
                        {icon}
                        <span style={{ lineHeight: 1 }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
