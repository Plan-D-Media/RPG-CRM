import React, { useState } from 'react';
import { InternalComplaint } from '../types/crmExtended';
import type { RolePermissions } from '../services/permissions';
import {
  ShieldAlert,
  CheckCircle2,
  Search,
  Sparkles,
  Eye,
  Pencil,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';

interface InternalComplaintsViewProps {
  complaints: InternalComplaint[];
  onAddInternalComplaint: (newTicket: InternalComplaint) => void;
  onUpdateInternalComplaint?: (updated: InternalComplaint) => void;
  onDeleteInternalComplaint?: (id: string) => void;
  initialMode?: 'add' | 'view';
  permissions?: RolePermissions;
}

// ─── Style helpers ───────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(15,21,37,0.85)', border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '6px', color: '#F8FAFC', padding: '8px 12px',
  fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', height: '38px',
};
const taStyle: React.CSSProperties = { ...inputStyle, height: '80px', resize: 'vertical', lineHeight: '1.5' };
const Lbl: React.FC<{ text: string }> = ({ text }) => (
  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>{text}</label>
);

const STAGE_COLORS: Record<string, string> = {
  'Frying / Baking': '#F97316',
  'Packaging / Sealing': '#38BDF8',
  'Pre-Extrusion': '#A78BFA',
  'Tumbler Coating': '#FBBF24',
  'Finished Goods Hold': '#EF4444',
};
const DISP_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'Scrap Quarantine':      { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444',  border: 'rgba(239,68,68,0.35)' },
  'Rework':                { bg: 'rgba(249,115,22,0.12)',  color: '#F97316',  border: 'rgba(249,115,22,0.35)' },
  'Released on Concession':{ bg: 'rgba(16,185,129,0.12)',  color: '#10B981',  border: 'rgba(16,185,129,0.35)' },
  'Lab Testing':           { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA',  border: 'rgba(167,139,250,0.35)' },
};

// ─── VIEW MODAL ──────────────────────────────────────────────────────────────
const ViewModal: React.FC<{ c: InternalComplaint; onClose: () => void }> = ({ c, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '660px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(52,211,153,0.4)' }}>
      {/* Header */}
      <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(16,185,129,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={17} color="#34D399" /> Internal Hold — <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}>{c.internalTicketNumber}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>{c.plantName} • {c.lineName}</div>
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { label: 'INSPECTION STAGE', value: c.inspectionStage, color: STAGE_COLORS[c.inspectionStage] ?? '#94A3B8' },
            { label: 'QTY HELD', value: `${c.quantityHeldKg} kg`, color: '#F59E0B' },
            { label: 'DISPOSITION', value: c.dispositionStatus, color: DISP_COLORS[c.dispositionStatus]?.color ?? '#94A3B8' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontWeight: 700, color, fontSize: '0.82rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Product & Batch */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px' }}>PRODUCT</div>
            <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>{c.productName}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px' }}>BATCH NUMBER</div>
            <div style={{ color: 'var(--brand-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.batchNumber}</div>
          </div>
        </div>

        {/* Defect */}
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#EF4444', marginBottom: '5px' }}>DEFECT OBSERVED / DEVIATION TYPE</div>
          <div style={{ color: '#F8FAFC', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.defectType}</div>
        </div>

        {/* Remarks */}
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', marginBottom: '5px' }}>QC INSPECTOR REMARKS & IMMEDIATE ACTION</div>
          <div style={{ color: '#F8FAFC', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.remarks}</div>
        </div>

        {/* Inspector & Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px' }}>QC INSPECTOR</div>
            <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{c.qcInspector}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px' }}>SAMPLE / INSPECTION TIME</div>
            <div style={{ color: '#F8FAFC', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{c.sampleTime}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.22)', padding: '10px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '3px' }}>REGISTERED AT</div>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{new Date(c.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '9px 24px' }}>Close</button>
      </div>
    </div>
  </div>
);

// ─── EDIT MODAL ──────────────────────────────────────────────────────────────
const EditModal: React.FC<{ c: InternalComplaint; onSave: (u: InternalComplaint) => void; onClose: () => void }> = ({ c, onSave, onClose }) => {
  const [plantName, setPlantName] = useState(c.plantName);
  const [lineName, setLineName] = useState(c.lineName);
  const [productName, setProductName] = useState(c.productName);
  const [batchNumber, setBatchNumber] = useState(c.batchNumber);
  const [sampleTime, setSampleTime] = useState(c.sampleTime);
  const [inspectionStage, setInspectionStage] = useState(c.inspectionStage);
  const [defectType, setDefectType] = useState(c.defectType);
  const [quantityHeldKg, setQuantityHeldKg] = useState(c.quantityHeldKg);
  const [dispositionStatus, setDispositionStatus] = useState(c.dispositionStatus);
  const [qcInspector, setQcInspector] = useState(c.qcInspector);
  const [remarks, setRemarks] = useState(c.remarks);
  const [error, setError] = useState('');

  const plantList = ['Geeta Snacks & Savouries','GKP Snacks Industries','Pampar Foods Pvt Ltd','Badshah Extrusion Plant','Atop Foods Co-Packer','Patwari Foods Facility','GRTS Manufacturing Hub','Devarpan Foods Ltd','Haridwar SIDCUL Unit 1','Baddi Extrusion Unit 2'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectType.trim() || !remarks.trim()) { setError('Defect type and remarks are required.'); return; }
    onSave({ ...c, plantName, lineName, productName, batchNumber, sampleTime, inspectionStage, defectType, quantityHeldKg: Number(quantityHeldKg), dispositionStatus, qcInspector, remarks });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '840px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,160,0,0.4)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(255,160,0,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pencil size={17} color="#FFA000" /> Edit Internal Hold — <span style={{ color: '#FFA000', fontFamily: 'var(--font-mono)' }}>{c.internalTicketNumber}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>Modify quality deviation details and save changes</div>
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
              <div><Lbl text="Plant Facility" /><select style={{ ...inputStyle, cursor: 'pointer' }} value={plantName} onChange={e => setPlantName(e.target.value)}>{plantList.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><Lbl text="Manufacturing Line" /><input style={inputStyle} value={lineName} onChange={e => setLineName(e.target.value)} required /></div>
              <div><Lbl text="Product Name & SKU" /><input style={inputStyle} value={productName} onChange={e => setProductName(e.target.value)} required /></div>
            </div>
            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
              <div><Lbl text="Batch Number" /><input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }} value={batchNumber} onChange={e => setBatchNumber(e.target.value)} required /></div>
              <div><Lbl text="Sample Time" /><input style={inputStyle} value={sampleTime} onChange={e => setSampleTime(e.target.value)} /></div>
              <div><Lbl text="Qty Held (kg)" /><input style={inputStyle} type="number" value={quantityHeldKg} onChange={e => setQuantityHeldKg(Number(e.target.value))} required /></div>
              <div>
                <Lbl text="Inspection Stage" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={inspectionStage} onChange={e => setInspectionStage(e.target.value as any)}>
                  <option value="Pre-Extrusion">Pre-Extrusion</option>
                  <option value="Frying / Baking">Frying / Baking</option>
                  <option value="Tumbler Coating">Tumbler Coating</option>
                  <option value="Packaging / Sealing">Packaging / Sealing</option>
                  <option value="Finished Goods Hold">Finished Goods Hold</option>
                </select>
              </div>
            </div>
            {/* Defect + Disposition */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div><Lbl text="Defect Type / Deviation Description" /><input style={inputStyle} value={defectType} onChange={e => setDefectType(e.target.value)} required /></div>
              <div>
                <Lbl text="Disposition Decision" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={dispositionStatus} onChange={e => setDispositionStatus(e.target.value as any)}>
                  <option value="Scrap Quarantine">Scrap Quarantine</option>
                  <option value="Rework">Rework</option>
                  <option value="Released on Concession">Released on Concession</option>
                  <option value="Lab Testing">Lab Testing</option>
                </select>
              </div>
            </div>
            {/* Remarks */}
            <div><Lbl text="Shift QC Inspector Remarks & Immediate Action" /><textarea style={taStyle as React.CSSProperties} value={remarks} onChange={e => setRemarks(e.target.value)} required /></div>
            {/* Inspector */}
            <div style={{ maxWidth: '320px' }}><Lbl text="Inspector Signature / Name" /><input style={inputStyle} value={qcInspector} onChange={e => setQcInspector(e.target.value)} required /></div>

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

// ─── DELETE MODAL ─────────────────────────────────────────────────────────────
const DeleteModal: React.FC<{ c: InternalComplaint; onConfirm: () => void; onClose: () => void }> = ({ c, onConfirm, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.45)' }}>
      <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(239,68,68,0.18) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={18} color="#EF4444" /> Delete Internal Hold
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
      </div>
      <div style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '0.9rem', color: '#F8FAFC', lineHeight: 1.65 }}>
          Are you sure you want to permanently delete internal quality hold<br />
          <strong style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{c.internalTicketNumber}</strong>
          {' '}at <strong>{c.plantName}</strong>?<br /><br />
          <span style={{ color: '#FCA5A5', fontSize: '0.82rem' }}>⚠ This action cannot be undone.</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(135deg,#EF4444 0%,#DC2626 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          >
            <Trash2 size={15} /> Yes, Delete Hold
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const InternalComplaintsView: React.FC<InternalComplaintsViewProps> = ({
  complaints,
  onAddInternalComplaint,
  onUpdateInternalComplaint,
  onDeleteInternalComplaint,
  initialMode = 'view',
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'view'>(initialMode);

  // Form state
  const [plantName, setPlantName] = useState('Geeta Snacks & Savouries');
  const [lineName, setLineName] = useState('Line 1 (Potato Chips Frying)');
  const [productName, setProductName] = useState('Too Yumm! Potato Chips Classic Salted');
  const [batchNumber, setBatchNumber] = useState('GT26-P09-C');
  const [sampleTime, setSampleTime] = useState('2026-09-17 11:30');
  const [inspectionStage, setInspectionStage] = useState<InternalComplaint['inspectionStage']>('Frying / Baking');
  const [defectType, setDefectType] = useState('Dark Edge Frying / Caramelized Sugar Discoloration');
  const [quantityHeldKg, setQuantityHeldKg] = useState(350);
  const [dispositionStatus, setDispositionStatus] = useState<InternalComplaint['dispositionStatus']>('Scrap Quarantine');
  const [qcInspector, setQcInspector] = useState('Sunita Roy (Shift QA)');
  const [remarks, setRemarks] = useState('Incoming potato lot had reducing sugar >0.25%, causing rapid browning in frying zone. Fryer temperature lowered and balance lot rejected.');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal state
  const [viewItem, setViewItem] = useState<InternalComplaint | null>(null);
  const [editItem, setEditItem] = useState<InternalComplaint | null>(null);
  const [deleteItem, setDeleteItem] = useState<InternalComplaint | null>(null);

  const plantList = ['Geeta Snacks & Savouries','GKP Snacks Industries','Pampar Foods Pvt Ltd','Badshah Extrusion Plant','Atop Foods Co-Packer','Patwari Foods Facility','GRTS Manufacturing Hub','Devarpan Foods Ltd','Haridwar SIDCUL Unit 1','Baddi Extrusion Unit 2'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: InternalComplaint = {
      id: `int-${Date.now()}`,
      internalTicketNumber: `INT-QA-2026-${Math.floor(100 + Math.random() * 900)}`,
      plantName, lineName, productName, batchNumber, sampleTime,
      inspectionStage, defectType, quantityHeldKg: Number(quantityHeldKg),
      dispositionStatus, qcInspector, remarks,
      createdAt: new Date().toISOString(),
    };
    onAddInternalComplaint(newComplaint);
    setSuccessMsg(`Internal Quality Hold ${newComplaint.internalTicketNumber} registered. ${newComplaint.quantityHeldKg} kg placed in ${newComplaint.dispositionStatus}.`);
    setActiveTab('view');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const filtered = complaints.filter(c =>
    c.internalTicketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.defectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuarantinedKg = complaints.reduce((acc, c) => acc + c.quantityHeldKg, 0);

  // ── Row action buttons ──────────────────────────────────────────────────
  const rowActions = (c: InternalComplaint) => [
    { key: 'view',   label: 'View',   icon: <Eye size={14} />,    color: '#38BDF8', bg: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.35)',  onClick: () => setViewItem(c) },
    { key: 'edit',   label: 'Edit',   icon: <Pencil size={14} />, color: '#FFA000', bg: 'rgba(255,160,0,0.12)',   border: 'rgba(255,160,0,0.35)',   onClick: () => setEditItem(c),   disabled: !onUpdateInternalComplaint },
    { key: 'delete', label: 'Delete', icon: <Trash2 size={14} />, color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   onClick: () => setDeleteItem(c), disabled: !onDeleteInternalComplaint },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* ── Modals ── */}
      {viewItem && <ViewModal c={viewItem} onClose={() => setViewItem(null)} />}
      {editItem && onUpdateInternalComplaint && (
        <EditModal c={editItem} onSave={updated => { onUpdateInternalComplaint(updated); setEditItem(null); }} onClose={() => setEditItem(null)} />
      )}
      {deleteItem && onDeleteInternalComplaint && (
        <DeleteModal c={deleteItem} onConfirm={() => { onDeleteInternalComplaint(deleteItem.id); setDeleteItem(null); }} onClose={() => setDeleteItem(null)} />
      )}

      {/* ── Header & Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={24} color="#10B981" />
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>Internal Quality Deviation & Hold Registry</h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Log in-process quality deviations, line rejections, quarantine holds, and corrective dispositions before market release.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {(['view', 'add'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', background: activeTab === tab ? '#10B981' : 'transparent', color: activeTab === tab ? '#FFF' : 'var(--text-secondary)' }}>
              {tab === 'view' ? 'View All complaint' : '+ Add New Complaint'}
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
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Register In-Process Quality Hold / Rejection</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Plant Facility</label>
                <select value={plantName} onChange={e => setPlantName(e.target.value)} className="form-select">{plantList.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Manufacturing Line</label>
                <input type="text" value={lineName} onChange={e => setLineName(e.target.value)} required className="form-input" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Product Name & SKU</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required className="form-input" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Batch Number</label>
                <input type="text" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} required className="form-input" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Inspection Stage</label>
                <select value={inspectionStage} onChange={e => setInspectionStage(e.target.value as any)} className="form-select">
                  <option value="Pre-Extrusion">Pre-Extrusion</option><option value="Frying / Baking">Frying / Baking</option><option value="Tumbler Coating">Tumbler Coating</option><option value="Packaging / Sealing">Packaging / Sealing</option><option value="Finished Goods Hold">Finished Goods Hold</option>
                </select></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quantity Held (kg)</label>
                <input type="number" value={quantityHeldKg} onChange={e => setQuantityHeldKg(Number(e.target.value))} required className="form-input" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Disposition Decision</label>
                <select value={dispositionStatus} onChange={e => setDispositionStatus(e.target.value as any)} className="form-select">
                  <option value="Scrap Quarantine">Scrap Quarantine</option><option value="Rework">Rework</option><option value="Released on Concession">Released on Concession</option><option value="Lab Testing">Lab Testing</option>
                </select></div>
            </div>
            <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Defect Type / Deviation Description</label>
              <input type="text" value={defectType} onChange={e => setDefectType(e.target.value)} required className="form-input" /></div>
            <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Shift QC Inspector Remarks & Immediate Action</label>
              <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} required className="form-textarea" /></div>
            <div style={{ maxWidth: '300px' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Inspector Signature / Name</label>
              <input type="text" value={qcInspector} onChange={e => setQcInspector(e.target.value)} required className="form-input" /></div>
            <button type="submit" className="btn" style={{ background: '#10B981', color: '#FFF', padding: '12px 20px', marginTop: '8px', fontWeight: 700 }}>
              <CheckCircle2 size={18} /><span>Register Internal Quality Hold</span>
            </button>
          </form>
        </div>
      ) : (
        /* ── VIEW TABLE ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* KPI Ribbon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {[
              { label: 'TOTAL INTERNAL HOLDS', value: `${complaints.length} Tickets`, color: '#FFF' },
              { label: 'TOTAL QUANTITY QUARANTINED', value: `${totalQuarantinedKg.toLocaleString()} kg`, color: '#F59E0B' },
              { label: 'MARKET RELEASE LEAKAGE', value: '0.0% Zero Defect Leak', color: '#10B981' },
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
                <input type="text" placeholder="Filter by Ticket, Batch, Defect..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-input" style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing {filtered.length} internal hold records</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>Internal Ticket</th>
                    <th style={{ padding: '10px 8px' }}>Plant & Line</th>
                    <th style={{ padding: '10px 8px' }}>Product & Batch</th>
                    <th style={{ padding: '10px 8px' }}>Stage</th>
                    <th style={{ padding: '10px 8px' }}>Defect Observed</th>
                    <th style={{ padding: '10px 8px' }}>Qty Held</th>
                    <th style={{ padding: '10px 8px' }}>Disposition</th>
                    <th style={{ padding: '10px 8px' }}>Inspector</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', minWidth: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No internal holds match your search.</td></tr>
                  ) : filtered.map(c => {
                    const disp = DISP_COLORS[c.dispositionStatus] ?? { bg: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: 'rgba(255,255,255,0.15)' };
                    const stageColor = STAGE_COLORS[c.inspectionStage] ?? '#94A3B8';
                    return (
                      <tr key={c.id}
                        style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34D399', whiteSpace: 'nowrap' }}>{c.internalTicketNumber}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ fontWeight: 600, color: '#FFF' }}>{c.plantName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.lineName}</div>
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>{c.productName}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: 'var(--brand-accent)' }}>{c.batchNumber}</div>
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 700, background: `${stageColor}22`, color: stageColor, border: `1px solid ${stageColor}55`, whiteSpace: 'nowrap' }}>
                            {c.inspectionStage}
                          </span>
                        </td>
                        <td style={{ padding: '10px 8px', maxWidth: '200px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.8rem' }} title={c.defectType}>{c.defectType}</div>
                        </td>
                        <td style={{ padding: '10px 8px', fontWeight: 700, color: '#F59E0B', whiteSpace: 'nowrap' }}>{c.quantityHeldKg} kg</td>
                        <td style={{ padding: '10px 8px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 700, background: disp.bg, color: disp.color, border: `1px solid ${disp.border}`, whiteSpace: 'nowrap' }}>
                            {c.dispositionStatus}
                          </span>
                        </td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{c.qcInspector}</td>

                        {/* ── Action Buttons ── */}
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {rowActions(c).map(({ key, label, icon, color, bg, border, onClick, disabled }) => (
                              <button
                                key={key}
                                onClick={disabled ? undefined : onClick}
                                title={label}
                                style={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                                  background: disabled ? 'rgba(255,255,255,0.04)' : bg,
                                  border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : border}`,
                                  borderRadius: '7px', padding: '5px 8px',
                                  cursor: disabled ? 'not-allowed' : 'pointer',
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
