import React, { useState } from 'react';
import { BreakdownLog } from '../types/crmExtended';
import type { RolePermissions } from '../services/permissions';
import {
  Wrench,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Search,
  FileSpreadsheet,
  Building2,
  Cpu,
  Eye,
  Pencil,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';

interface BreakdownLogViewProps {
  breakdowns: BreakdownLog[];
  onAddBreakdown: (newLog: BreakdownLog) => void;
  onUpdateBreakdown?: (updated: BreakdownLog) => void;
  onDeleteBreakdown?: (id: string) => void;
  initialMode?: 'add' | 'view';
  permissions?: RolePermissions;
}

// ─── Shared style helpers ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(15,21,37,0.85)', border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '6px', color: '#F8FAFC', padding: '8px 12px',
  fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', height: '38px',
};
const taStyle: React.CSSProperties = { ...inputStyle, height: '72px', resize: 'vertical', lineHeight: '1.5' };
const Label: React.FC<{ text: string }> = ({ text }) => (
  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>{text}</label>
);

// ─── View Modal ──────────────────────────────────────────────────────────────
const ViewModal: React.FC<{ log: BreakdownLog; onClose: () => void }> = ({ log, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(56,189,248,0.4)' }}>
      {/* Header */}
      <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(56,189,248,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="#38BDF8" /> Breakdown Log — <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{log.logNumber}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>{log.plantName} • {log.lineName}</div>
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { label: 'BREAKDOWN TYPE', value: log.breakdownType, color: '#FFA000' },
            { label: 'DOWNTIME', value: `${log.downtimeMinutes} mins`, color: '#EF4444' },
            { label: 'STATUS', value: log.status, color: '#10B981' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '4px', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'START TIME', value: log.startTime },
            { label: 'END TIME', value: log.endTime },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '3px' }}>{label}</div>
              <div style={{ color: '#F8FAFC', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Equipment */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '4px' }}>EQUIPMENT / MACHINE COMPONENT</div>
          <div style={{ color: '#FFF', fontWeight: 600 }}>{log.equipmentName}</div>
        </div>

        {/* Root Cause */}
        <div style={{ background: 'rgba(255,74,28,0.07)', border: '1px solid rgba(255,74,28,0.2)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #FF4A1C' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF4A1C', marginBottom: '5px' }}>ROOT CAUSE FINDINGS</div>
          <div style={{ color: '#F8FAFC', fontSize: '0.85rem', lineHeight: 1.6 }}>{log.rootCause}</div>
        </div>

        {/* Action Taken */}
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981', marginBottom: '5px' }}>CORRECTIVE ACTION TAKEN</div>
          <div style={{ color: '#F8FAFC', fontSize: '0.85rem', lineHeight: 1.6 }}>{log.actionTaken}</div>
        </div>

        {/* Technician */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={16} color="#38BDF8" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>TECHNICIAN / MAINTENANCE ENGINEER</div>
            <div style={{ color: '#FFF', fontWeight: 600 }}>{log.technicianName}</div>
          </div>
        </div>

        {/* AI Suggestion */}
        {log.aiDiagnosticSuggestion && (
          <div style={{ background: 'rgba(255,160,0,0.1)', border: '1px solid rgba(255,160,0,0.3)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFA000', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} /> AI PREDICTIVE MAINTENANCE INSIGHT
            </div>
            <div style={{ color: '#F8FAFC', fontSize: '0.82rem', lineHeight: 1.6 }}>{log.aiDiagnosticSuggestion}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '9px 24px' }}>Close</button>
      </div>
    </div>
  </div>
);

// ─── Edit Modal ──────────────────────────────────────────────────────────────
const EditModal: React.FC<{ log: BreakdownLog; onSave: (updated: BreakdownLog) => void; onClose: () => void }> = ({ log, onSave, onClose }) => {
  const [plantName, setPlantName] = useState(log.plantName);
  const [lineName, setLineName] = useState(log.lineName);
  const [equipmentName, setEquipmentName] = useState(log.equipmentName);
  const [breakdownType, setBreakdownType] = useState(log.breakdownType);
  const [startTime, setStartTime] = useState(log.startTime);
  const [endTime, setEndTime] = useState(log.endTime);
  const [downtimeMinutes, setDowntimeMinutes] = useState(log.downtimeMinutes);
  const [rootCause, setRootCause] = useState(log.rootCause);
  const [actionTaken, setActionTaken] = useState(log.actionTaken);
  const [technicianName, setTechnicianName] = useState(log.technicianName);
  const [status, setStatus] = useState(log.status);
  const [error, setError] = useState('');

  const plantList = ['Geeta Snacks & Savouries', 'GKP Snacks Industries', 'Pampar Foods Pvt Ltd', 'Badshah Extrusion Plant', 'Atop Foods Co-Packer', 'Patwari Foods Facility', 'GRTS Manufacturing Hub', 'Devarpan Foods Ltd', 'Haridwar SIDCUL Unit 1', 'Baddi Extrusion Unit 2'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause.trim() || !actionTaken.trim()) { setError('Root Cause and Action Taken are required.'); return; }
    onSave({ ...log, plantName, lineName, equipmentName, breakdownType, startTime, endTime, downtimeMinutes: Number(downtimeMinutes), rootCause, actionTaken, technicianName, status });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '820px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,160,0,0.4)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(255,160,0,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pencil size={17} color="#FFA000" /> Edit Breakdown Log — <span style={{ color: '#FFA000', fontFamily: 'var(--font-mono)' }}>{log.logNumber}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>Modify breakdown details and save changes</div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ margin: '14px 24px 0', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#FCA5A5', alignItems: 'center' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}
          <form onSubmit={handleSave} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <Label text="Plant Name" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={plantName} onChange={e => setPlantName(e.target.value)}>
                  {plantList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div><Label text="Manufacturing Line" /><input style={inputStyle} value={lineName} onChange={e => setLineName(e.target.value)} required /></div>
              <div><Label text="Equipment Component" /><input style={inputStyle} value={equipmentName} onChange={e => setEquipmentName(e.target.value)} required /></div>
            </div>
            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <Label text="Breakdown Type" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={breakdownType} onChange={e => setBreakdownType(e.target.value as any)}>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Pneumatic">Pneumatic</option>
                  <option value="Instrumentation">Instrumentation</option>
                  <option value="Operational">Operational</option>
                </select>
              </div>
              <div><Label text="Start Time" /><input style={inputStyle} value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
              <div><Label text="End Time" /><input style={inputStyle} value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
              <div><Label text="Downtime (mins)" /><input style={inputStyle} type="number" value={downtimeMinutes} onChange={e => setDowntimeMinutes(Number(e.target.value))} /></div>
            </div>
            {/* Row 3 */}
            <div><Label text="Root Cause Findings" /><textarea style={taStyle as React.CSSProperties} value={rootCause} onChange={e => setRootCause(e.target.value)} required /></div>
            <div><Label text="Corrective Action Taken & Replacement Parts" /><textarea style={taStyle as React.CSSProperties} value={actionTaken} onChange={e => setActionTaken(e.target.value)} required /></div>
            {/* Row 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><Label text="Technician / Maintenance Engineer" /><input style={inputStyle} value={technicianName} onChange={e => setTechnicianName(e.target.value)} required /></div>
              <div>
                <Label text="Status" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={status} onChange={e => setStatus(e.target.value as any)}>
                  <option value="Resolved">Resolved</option>
                  <option value="Under Observation">Under Observation</option>
                  <option value="Critical Pending">Critical Pending</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 28px' }}><CheckCircle2 size={16} /> Save Changes</button>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
const DeleteModal: React.FC<{ log: BreakdownLog; onConfirm: () => void; onClose: () => void }> = ({ log, onConfirm, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.45)' }}>
      <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(239,68,68,0.18) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={18} color="#EF4444" /> Delete Breakdown Log
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
      </div>
      <div style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '0.9rem', color: '#F8FAFC', lineHeight: 1.65 }}>
          Are you sure you want to permanently delete breakdown log<br />
          <strong style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{log.logNumber}</strong>
          {' '}at <strong>{log.plantName}</strong>?<br /><br />
          <span style={{ color: '#FCA5A5', fontSize: '0.82rem' }}>⚠ This action cannot be undone.</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(135deg,#EF4444 0%,#DC2626 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          >
            <Trash2 size={15} /> Yes, Delete Log
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const BreakdownLogView: React.FC<BreakdownLogViewProps> = ({
  breakdowns,
  onAddBreakdown,
  onUpdateBreakdown,
  onDeleteBreakdown,
  initialMode = 'view',
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'view'>(initialMode);

  // Add form fields
  const [plantName, setPlantName] = useState('GKP Snacks Industries');
  const [lineName, setLineName] = useState('Line 2 (High-Speed Karare Packer)');
  const [equipmentName, setEquipmentName] = useState('Form-Fill-Seal Sealing Jaw Assembly');
  const [breakdownType, setBreakdownType] = useState<BreakdownLog['breakdownType']>('Electrical');
  const [startTime, setStartTime] = useState('2026-09-17 09:00');
  const [endTime, setEndTime] = useState('2026-09-17 10:30');
  const [downtimeMinutes, setDowntimeMinutes] = useState(90);
  const [rootCause, setRootCause] = useState('Heating cartridge thermal resistance open circuit causing seal jaw temperature drop.');
  const [actionTaken, setActionTaken] = useState('Replaced cartridge with high-temperature ceramic element; verified with infrared pyrometer.');
  const [technicianName, setTechnicianName] = useState('S. K. Verma');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal state
  const [viewLog, setViewLog] = useState<BreakdownLog | null>(null);
  const [editLog, setEditLog] = useState<BreakdownLog | null>(null);
  const [deleteLog, setDeleteLog] = useState<BreakdownLog | null>(null);

  const plantList = ['Geeta Snacks & Savouries', 'GKP Snacks Industries', 'Pampar Foods Pvt Ltd', 'Badshah Extrusion Plant', 'Atop Foods Co-Packer', 'Patwari Foods Facility', 'GRTS Manufacturing Hub', 'Devarpan Foods Ltd', 'Haridwar SIDCUL Unit 1', 'Baddi Extrusion Unit 2'];

  const handleRunAiMaintenanceCheck = () => {
    setAiSuggestion(`AI Diagnostic: This is the 3rd electrical failure on "${equipmentName}" in 60 days across ${plantName}. High probability of wire fatigue due to cyclic carriage reciprocation. Recommendation: Upgrade to continuous-flex silicone wiring harness (IGUS Chainflex) to extend MTBF by 300%.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: BreakdownLog = {
      id: `brk-${Date.now()}`,
      logNumber: `BRK-2026-${Math.floor(100 + Math.random() * 900)}`,
      plantName, lineName, equipmentName, breakdownType,
      startTime, endTime, downtimeMinutes: Number(downtimeMinutes),
      rootCause, actionTaken, technicianName,
      aiDiagnosticSuggestion: aiSuggestion || undefined,
      status: 'Resolved',
    };
    onAddBreakdown(newLog);
    setSuccessMsg(`Breakdown ${newLog.logNumber} successfully logged and synchronized with Plant Maintenance Register.`);
    setActiveTab('view');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const filtered = breakdowns.filter(b =>
    b.logNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDowntimeHrs = (breakdowns.reduce((acc, b) => acc + b.downtimeMinutes, 0) / 60).toFixed(1);

  // ── Action buttons config ────────────────────────────────────────────────
  const rowActions = (b: BreakdownLog) => [
    { key: 'view', label: 'View', icon: <Eye size={14} />, color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)', onClick: () => setViewLog(b) },
    { key: 'edit', label: 'Edit', icon: <Pencil size={14} />, color: '#FFA000', bg: 'rgba(255,160,0,0.12)', border: 'rgba(255,160,0,0.35)', onClick: () => setEditLog(b), disabled: !onUpdateBreakdown },
    { key: 'delete', label: 'Delete', icon: <Trash2 size={14} />, color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', onClick: () => setDeleteLog(b), disabled: !onDeleteBreakdown },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* ── Modals ── */}
      {viewLog && <ViewModal log={viewLog} onClose={() => setViewLog(null)} />}
      {editLog && onUpdateBreakdown && (
        <EditModal
          log={editLog}
          onSave={(updated) => { onUpdateBreakdown(updated); setEditLog(null); }}
          onClose={() => setEditLog(null)}
        />
      )}
      {deleteLog && onDeleteBreakdown && (
        <DeleteModal
          log={deleteLog}
          onConfirm={() => { onDeleteBreakdown(deleteLog.id); setDeleteLog(null); }}
          onClose={() => setDeleteLog(null)}
        />
      )}

      {/* ── Header & Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={24} color="#3B82F6" />
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>Plant Breakdown Log Sheet</h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Track machine line stoppages, downtime minutes, root cause diagnostics, and predictive MTBF suggestions.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {(['view', 'add'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn"
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', background: activeTab === tab ? '#3B82F6' : 'transparent', color: activeTab === tab ? '#FFF' : 'var(--text-secondary)' }}
            >
              {tab === 'view' ? 'View All Breakdown' : '+ Add New Breakdown'}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="glass-panel" style={{ padding: '14px 18px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="#10B981" />
          <span style={{ fontSize: '0.88rem', color: '#FFF', fontWeight: 600 }}>{successMsg}</span>
        </div>
      )}

      {/* ── ADD FORM ── */}
      {activeTab === 'add' ? (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Log Machine / Packaging Line Breakdown</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Plant Name</label>
                <select value={plantName} onChange={(e) => setPlantName(e.target.value)} className="form-select">{plantList.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Manufacturing Line</label>
                <input type="text" value={lineName} onChange={(e) => setLineName(e.target.value)} required className="form-input" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Equipment / Machine Component</label>
                <input type="text" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} required className="form-input" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Breakdown Type</label>
                <select value={breakdownType} onChange={(e) => setBreakdownType(e.target.value as any)} className="form-select">
                  <option value="Electrical">Electrical</option><option value="Mechanical">Mechanical</option><option value="Pneumatic">Pneumatic</option><option value="Instrumentation">Instrumentation</option><option value="Operational">Operational</option>
                </select></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Start Time</label>
                <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="form-input" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>End Time</label>
                <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="form-input" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Downtime (Minutes)</label>
                <input type="number" value={downtimeMinutes} onChange={(e) => setDowntimeMinutes(Number(e.target.value))} required className="form-input" /></div>
            </div>
            <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Root Cause Findings</label>
              <textarea rows={2} value={rootCause} onChange={(e) => setRootCause(e.target.value)} required className="form-textarea" /></div>
            <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Corrective Action Taken & Replacement Parts</label>
              <textarea rows={2} value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} required className="form-textarea" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'flex-end' }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Technician / Maintenance Engineer</label>
                <input type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} required className="form-input" /></div>
              <div><button type="button" onClick={handleRunAiMaintenanceCheck} className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--brand-primary)', color: 'var(--brand-accent)' }}>
                <Sparkles size={16} /><span>Run AI MTBF & Failure Diagnostics</span></button></div>
            </div>
            {aiSuggestion && (
              <div style={{ padding: '12px 16px', background: 'rgba(255,74,28,0.1)', border: '1px solid var(--brand-primary)', borderRadius: '8px', fontSize: '0.82rem', color: '#FFF' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '4px' }}>⚡ AI Predictive Maintenance Insight</div>
                <div>{aiSuggestion}</div>
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', marginTop: '8px' }}>
              <CheckCircle2 size={18} /><span>Save & Publish Breakdown Log</span>
            </button>
          </form>
        </div>
      ) : (
        /* ── VIEW TABLE ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* KPI Ribbon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {[
              { label: 'TOTAL RECORDED INCIDENTS', value: `${breakdowns.length} Logs`, color: '#FFF' },
              { label: 'TOTAL DOWNTIME LOSS', value: `${totalDowntimeHrs} Hours`, color: '#EF4444' },
              { label: 'AVERAGE MTTR (REPAIR TIME)', value: '86.6 Minutes', color: '#10B981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-panel" style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{label}</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color, marginTop: '2px' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Filter by Log #, Plant, Machine..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-input" style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing {filtered.length} breakdown records</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>Log #</th>
                    <th style={{ padding: '10px 8px' }}>Plant & Line</th>
                    <th style={{ padding: '10px 8px' }}>Equipment Component</th>
                    <th style={{ padding: '10px 8px' }}>Type</th>
                    <th style={{ padding: '10px 8px' }}>Downtime</th>
                    <th style={{ padding: '10px 8px' }}>Root Cause Summary</th>
                    <th style={{ padding: '10px 8px' }}>Technician</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', minWidth: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No logs match your search.</td></tr>
                  ) : filtered.map(b => (
                    <tr
                      key={b.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38BDF8', whiteSpace: 'nowrap' }}>{b.logNumber}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{b.plantName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.lineName}</div>
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-main)' }}>{b.equipmentName}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className="badge" style={{
                          background: b.breakdownType === 'Electrical' ? 'rgba(251,191,36,0.15)' : b.breakdownType === 'Mechanical' ? 'rgba(249,115,22,0.15)' : b.breakdownType === 'Pneumatic' ? 'rgba(56,189,248,0.15)' : 'rgba(167,139,250,0.15)',
                          color: b.breakdownType === 'Electrical' ? '#FBBF24' : b.breakdownType === 'Mechanical' ? '#F97316' : b.breakdownType === 'Pneumatic' ? '#38BDF8' : '#A78BFA',
                          border: 'none',
                        }}>
                          {b.breakdownType}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: '#EF4444' }}>{b.downtimeMinutes} mins</td>
                      <td style={{ padding: '10px 8px', maxWidth: '220px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.8rem' }} title={b.rootCause}>{b.rootCause}</div>
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{b.technicianName}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className="badge" style={{
                          background: b.status === 'Resolved' ? 'rgba(16,185,129,0.12)' : b.status === 'Critical Pending' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)',
                          color: b.status === 'Resolved' ? '#10B981' : b.status === 'Critical Pending' ? '#EF4444' : '#FBBF24',
                          border: `1px solid ${b.status === 'Resolved' ? 'rgba(16,185,129,0.3)' : b.status === 'Critical Pending' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
                        }}>
                          {b.status}
                        </span>
                      </td>

                      {/* ── Action Buttons ── */}
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {rowActions(b).map(({ key, label, icon, color, bg, border, onClick, disabled }) => (
                            <button
                              key={key}
                              onClick={disabled ? undefined : onClick}
                              title={label}
                              style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: '2px',
                                background: disabled ? 'rgba(255,255,255,0.04)' : bg,
                                border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : border}`,
                                borderRadius: '7px', padding: '5px 8px', cursor: disabled ? 'not-allowed' : 'pointer',
                                color: disabled ? '#64748B' : color,
                                fontSize: '0.58rem', fontWeight: 700,
                                fontFamily: 'inherit', minWidth: '38px',
                                transition: 'all 0.18s ease', letterSpacing: '0.02em',
                                opacity: disabled ? 0.5 : 1,
                              }}
                              onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${border}`; } }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
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
        </div>
      )}
    </div>
  );
};
