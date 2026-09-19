import React, { useState } from 'react';
import { ComplaintTicket } from '../types/crm';
import { PRODUCTS_CATALOG, PLANTS_FACILITIES } from '../data/crmData';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

// ─── Edit Complaint Modal ────────────────────────────────────────────────────
interface EditComplaintModalProps {
  ticket: ComplaintTicket;
  onSave: (updated: ComplaintTicket) => void;
  onClose: () => void;
}

export const EditComplaintModal: React.FC<EditComplaintModalProps> = ({ ticket, onSave, onClose }) => {
  const [consumerName, setConsumerName] = useState(ticket.consumerName);
  const [consumerPhone, setConsumerPhone] = useState(ticket.consumerPhone);
  const [consumerCity, setConsumerCity] = useState(ticket.consumerCity);
  const [consumerState, setConsumerState] = useState(ticket.consumerState);
  const [batchNumber, setBatchNumber] = useState(ticket.batchNumber);
  const [mfgDate, setMfgDate] = useState(ticket.mfgDate);
  const [plantCode, setPlantCode] = useState(ticket.plantCode);
  const [category, setCategory] = useState(ticket.category);
  const [severity, setSeverity] = useState(ticket.severity);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  const [errors, setErrors] = useState<string[]>([]);

  const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Delhi NCR', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Rajasthan', 'Gujarat', 'Uttar Pradesh'];

  const validate = () => {
    const errs: string[] = [];
    if (!consumerName.trim()) errs.push('Customer Name required');
    if (!consumerPhone.trim()) errs.push('Contact No. required');
    if (!description.trim()) errs.push('Description required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...ticket,
      consumerName,
      consumerPhone,
      consumerCity,
      consumerState,
      batchNumber,
      mfgDate,
      plantCode,
      category,
      severity,
      description,
      status,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(15,21,37,0.85)', border: '1px solid var(--border-medium)',
    borderRadius: '6px', color: 'var(--text-main)', padding: '8px 12px',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', height: '38px',
  };
  const Label: React.FC<{ text: string; req?: boolean }> = ({ text, req }) => (
    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
      {text}{req && <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>}
    </label>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '860px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(255,74,28,0.18) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
              Edit Complaint — <span style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>{ticket.ticketNumber}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Modify complaint details and save changes</div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {errors.length > 0 && (
            <div style={{ margin: '16px 24px 0', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#FCA5A5' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <ul style={{ paddingLeft: '14px' }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}

          <form onSubmit={handleSave} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div><Label text="Customer Name" req /><input style={inputStyle} value={consumerName} onChange={e => setConsumerName(e.target.value)} required /></div>
              <div><Label text="Contact No." req /><input style={inputStyle} value={consumerPhone} onChange={e => setConsumerPhone(e.target.value)} required /></div>
              <div><Label text="Severity" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={severity} onChange={e => setSeverity(e.target.value as any)}>
                  <option value="Critical">Critical (P0 Hazard)</option>
                  <option value="High">High (P1 Plant Alert)</option>
                  <option value="Medium">Medium (P2 Quality)</option>
                  <option value="Low">Low (P3 Cosmetic)</option>
                </select>
              </div>
            </div>
            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><Label text="City" /><input style={inputStyle} value={consumerCity} onChange={e => setConsumerCity(e.target.value)} /></div>
              <div><Label text="Region / State" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={consumerState} onChange={e => setConsumerState(e.target.value)}>
                  <option value="">Select Region</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div><Label text="Batch No." /><input style={inputStyle} value={batchNumber} onChange={e => setBatchNumber(e.target.value)} /></div>
              <div><Label text="Mfg. Date" /><input type="date" style={inputStyle} value={mfgDate} onChange={e => setMfgDate(e.target.value)} /></div>
              <div><Label text="Plant Facility" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={plantCode} onChange={e => setPlantCode(e.target.value)}>
                  {PLANTS_FACILITIES.map(p => <option key={p.code} value={p.code}>{p.code} — {p.name.split(' ').slice(0, 3).join(' ')}</option>)}
                </select>
              </div>
            </div>
            {/* Row 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div><Label text="Defect Category" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={e => setCategory(e.target.value as any)}>
                  <option value="Packaging Defect (Seal Leak / Deflated)">Packaging Defect (Seal Leak / Deflated)</option>
                  <option value="Foreign Matter / Contaminant">Foreign Matter / Contaminant</option>
                  <option value="Burnt / Overcooked / Color Anomaly">Burnt / Overcooked / Color Anomaly</option>
                  <option value="Taste / Rancidity / Oil Off-Odor">Taste / Rancidity / Oil Off-Odor</option>
                  <option value="Underweight / Net Content Discrepancy">Underweight / Net Content Discrepancy</option>
                  <option value="Seasoning Imbalance / Missing Spices">Seasoning Imbalance / Missing Spices</option>
                  <option value="Puffiness / Gas Swelling">Puffiness / Gas Swelling</option>
                </select>
              </div>
              <div><Label text="Status" />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={status} onChange={e => setStatus(e.target.value as any)}>
                  <option value="Logged">Logged</option>
                  <option value="AI_Triaged">AI Triaged</option>
                  <option value="Plant_Investigation">Plant Investigation</option>
                  <option value="CAPA_Generated">CAPA Generated</option>
                  <option value="CQA_Reviewed">CQA Reviewed</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>
            </div>
            {/* Description */}
            <div><Label text="Complaint Description" req />
              <textarea
                style={{ ...inputStyle, height: '90px', resize: 'vertical', lineHeight: '1.5' } as React.CSSProperties}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 28px' }}>
                <CheckCircle2 size={16} /> Save Changes
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Assign Complaint Modal ──────────────────────────────────────────────────
interface AssignModalProps {
  ticket: ComplaintTicket;
  mode: 'assign' | 'assignL1';
  onSave: (updated: ComplaintTicket) => void;
  onClose: () => void;
}

const L1_AGENTS = ['Ravi Kumar (QA Analyst)', 'Priya Sharma (Consumer Relations)', 'Karan Mehta (Field Rep)', 'Sunita Rao (Quality Lead)', 'Arjun Das (Support Specialist)'];
const L2_AGENTS = ['Dr. Rajesh Sharma (Lead QA)', 'Sunita Verma (Plant QA Manager)', 'K. Venkatraman (Regional Quality Lead)', 'Amitabh Sen (CQA Auditor)'];

export const AssignModal: React.FC<AssignModalProps> = ({ ticket, mode, onSave, onClose }) => {
  const isL1 = mode === 'assignL1';
  const agents = isL1 ? L1_AGENTS : [...PLANTS_FACILITIES.map(p => `${p.qaHead} — ${p.code}`), ...L2_AGENTS];
  const [selectedAgent, setSelectedAgent] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState(ticket.severity);
  const [done, setDone] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(15,21,37,0.85)', border: '1px solid var(--border-medium)',
    borderRadius: '6px', color: 'var(--text-main)', padding: '8px 12px',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', height: '38px',
  };

  const handleAssign = () => {
    if (!selectedAgent) { alert('Please select an agent to assign.'); return; }
    const notes = `[${isL1 ? 'L1 Assignment' : 'Assignment'}] Assigned to: ${selectedAgent}. Priority: ${priority}. Note: ${note || 'None'}`;
    onSave({
      ...ticket,
      status: isL1 ? 'Logged' : 'Plant_Investigation',
      plantRemarks: notes,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', borderRadius: '18px', border: '1px solid rgba(16,185,129,0.4)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={32} color="#10B981" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#FFF' }}>Complaint Assigned!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Ticket <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{ticket.ticketNumber}</span> has been assigned to <strong style={{ color: '#FFF' }}>{selectedAgent}</strong>.
          </p>
          <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 28px' }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', borderRadius: '18px', overflow: 'hidden', border: `1px solid ${isL1 ? 'rgba(56,189,248,0.4)' : 'rgba(255,160,0,0.4)'}` }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', background: `linear-gradient(90deg,${isL1 ? 'rgba(56,189,248,0.15)' : 'rgba(255,160,0,0.15)'} 0%,rgba(17,23,38,0.95) 100%)`, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} color={isL1 ? '#38BDF8' : 'var(--brand-accent)'} />
              {isL1 ? 'Assign to L1 Support' : 'Assign Complaint'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{ticket.ticketNumber} — {ticket.product.name}</div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>

        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Ticket Summary */}
          <div style={{ display: 'flex', gap: '10px', padding: '12px 14px', background: 'rgba(0,0,0,0.35)', borderRadius: '10px', fontSize: '0.82rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>CONSUMER</div>
              <div style={{ color: '#FFF', fontWeight: 600 }}>{ticket.consumerName}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{ticket.consumerCity}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>BATCH</div>
              <div style={{ color: 'var(--brand-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{ticket.batchNumber}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>SEVERITY</div>
              <span className={`badge badge-${ticket.severity.toLowerCase()}`}>{ticket.severity}</span>
            </div>
          </div>

          {/* Agent Select */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              {isL1 ? 'Select L1 Agent' : 'Select Plant QA / Assignee'}<span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>
            </label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
              <option value="">-- Select Agent --</option>
              {agents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Assignment Priority</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Critical', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as any)}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid',
                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                    background: priority === p
                      ? p === 'Critical' ? 'rgba(239,68,68,0.25)' : p === 'High' ? 'rgba(249,115,22,0.25)' : p === 'Medium' ? 'rgba(251,191,36,0.25)' : 'rgba(16,185,129,0.25)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: priority === p
                      ? p === 'Critical' ? '#EF4444' : p === 'High' ? '#F97316' : p === 'Medium' ? '#FBBF24' : '#10B981'
                      : 'var(--border-subtle)',
                    color: priority === p ? '#FFF' : 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s ease',
                  }}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Assignment Note (optional)</label>
            <textarea
              style={{ ...inputStyle, height: '72px', resize: 'none', lineHeight: '1.5' } as React.CSSProperties}
              placeholder="Add instructions or context for the assignee..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleAssign}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 700,
                fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                background: isL1 ? 'linear-gradient(135deg,#38BDF8 0%,#0EA5E9 100%)' : 'var(--brand-gradient)',
                color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: isL1 ? '0 4px 14px rgba(56,189,248,0.35)' : '0 4px 14px rgba(255,74,28,0.35)',
              }}
            >
              <UserPlus size={16} /> {isL1 ? 'Assign to L1' : 'Confirm Assignment'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  ticket: ComplaintTicket;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ ticket, onConfirm, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.45)' }}>
      <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(239,68,68,0.18) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
          Delete Complaint
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
      </div>
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          Are you sure you want to permanently delete complaint <br />
          <strong style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{ticket.ticketNumber}</strong>
          {' '}by <strong>{ticket.consumerName}</strong>?
          <br /><br />
          <span style={{ color: '#FCA5A5', fontSize: '0.82rem' }}>⚠ This action cannot be undone.</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              background: 'linear-gradient(135deg,#EF4444 0%,#DC2626 100%)',
              color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
            }}
          >
            Yes, Delete Complaint
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Report Modal ────────────────────────────────────────────────────────────
interface ReportModalProps {
  ticket: ComplaintTicket;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ ticket, onClose }) => {
  const reportLines = [
    `TOO YUMM! CRM — COMPLAINT REPORT`,
    `Generated: ${new Date().toLocaleString()}`,
    `═══════════════════════════════════════════`,
    ``,
    `TICKET INFORMATION`,
    `  Ticket No.     : ${ticket.ticketNumber}`,
    `  Status         : ${ticket.status.replace('_', ' ')}`,
    `  Severity       : ${ticket.severity}`,
    `  Created At     : ${new Date(ticket.createdAt).toLocaleString()}`,
    ``,
    `CONSUMER DETAILS`,
    `  Name           : ${ticket.consumerName}`,
    `  Phone          : ${ticket.consumerPhone}`,
    `  City           : ${ticket.consumerCity}`,
    `  State          : ${ticket.consumerState}`,
    ``,
    `PRODUCT & BATCH`,
    `  Product        : ${ticket.product.name}`,
    `  SKU Code       : ${ticket.product.skuCode}`,
    `  Pack Size      : ${ticket.product.packSize}`,
    `  Flavour        : ${ticket.product.flavor}`,
    `  Batch No.      : ${ticket.batchNumber}`,
    `  Mfg. Date      : ${ticket.mfgDate}`,
    `  Plant Code     : ${ticket.plantCode}`,
    `  Mfg. Line      : ${ticket.manufacturingLine}`,
    ``,
    `COMPLAINT DETAILS`,
    `  Category       : ${ticket.category}`,
    `  Description    : ${ticket.description}`,
    ``,
    ticket.aiVisionAnalysis ? [
      `AI ANALYSIS`,
      `  Detected Defect: ${ticket.aiVisionAnalysis.detectedDefect}`,
      `  Confidence     : ${Math.round(ticket.aiVisionAnalysis.confidenceScore * 100)}%`,
      `  Features       :`,
      ...ticket.aiVisionAnalysis.annotatedFeatures.map(f => `    • ${f}`),
      `  Recommendation : ${ticket.aiVisionAnalysis.recommendation}`,
      ``,
    ].join('\n') : '',
    ticket.capa ? [
      `CAPA DETAILS`,
      `  Corrective Action: ${ticket.capa.d5_correctiveAction}`,
      `  Preventive Measure: ${ticket.capa.d7_preventiveMaintenance}`,
      ``,
    ].join('\n') : '',
    ticket.compensationVoucher ? [
      `COMPENSATION`,
      `  Voucher Code   : ${ticket.compensationVoucher.code}`,
      `  Amount         : ₹${ticket.compensationVoucher.amount}`,
      `  Status         : ${ticket.compensationVoucher.status}`,
      ``,
    ].join('\n') : '',
    `═══════════════════════════════════════════`,
    `Too Yumm! CRM • RP-Sanjiv Goenka Group`,
    `FSSAI License: 10017031002079`,
  ].filter(Boolean).join('\n');

  const handleDownload = () => {
    const blob = new Blob([reportLines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Complaint-Report-${ticket.ticketNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.4)' }}>
        <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg,rgba(16,185,129,0.15) 0%,rgba(17,23,38,0.95) 100%)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
              📄 Complaint Report — <span style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>{ticket.ticketNumber}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Full incident report preview</div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}><X size={17} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <pre style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-main)',
            background: 'rgba(0,0,0,0.45)', padding: '16px 18px', borderRadius: '10px',
            border: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap', lineHeight: 1.7,
          }}>
            {reportLines}
          </pre>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg,#10B981 0%,#059669 100%)',
              color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 24px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            }}
          >
            ⬇ Download Report (.txt)
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Close</button>
        </div>
      </div>
    </div>
  );
};
