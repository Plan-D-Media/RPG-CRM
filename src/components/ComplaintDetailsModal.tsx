import React from 'react';
import { ComplaintTicket } from '../types/crm';
import { 
  X, 
  Sparkles, 
  Building2, 
  MapPin, 
  Barcode, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Gift,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface ComplaintDetailsModalProps {
  ticket: ComplaintTicket | null;
  onClose: () => void;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  ticket,
  onClose
}) => {
  if (!ticket) return null;

  const steps = ['Logged', 'AI_Triaged', 'Plant_Investigation', 'CAPA_Generated', 'CQA_Reviewed', 'Resolved'];
  const currentStepIndex = steps.indexOf(ticket.status);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(90deg, rgba(255, 74, 28, 0.2) 0%, rgba(17, 23, 38, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--brand-primary)' }}>
                {ticket.ticketNumber}
              </span>
              <span className={`badge ${
                ticket.severity === 'Critical' ? 'badge-critical' :
                ticket.severity === 'High' ? 'badge-high' :
                ticket.severity === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                {ticket.severity}
              </span>
              <span className="badge badge-info">{ticket.status.replace('_', ' ')}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Logged on {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Lifecycle Progress Bar */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>
              INCIDENT LIFECYCLE WORKFLOW
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isPassed ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.1)',
                      color: '#FFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrent ? '0 0 10px var(--brand-primary)' : 'none'
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: isPassed ? '#FFF' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400 }}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product & Manufacturing Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PRODUCT & SKU</span>
              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>{ticket.product.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ticket.product.skuCode}</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BATCH & PLANT</span>
              <div style={{ fontWeight: 700, color: 'var(--brand-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {ticket.batchNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Plant Code: {ticket.plantCode}</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CONSUMER ORIGIN</span>
              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>{ticket.consumerName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ticket.consumerCity}, {ticket.consumerState}</div>
            </div>
          </div>

          {/* Consumer Description & Sensory Notes */}
          <div style={{ background: 'rgba(255, 74, 28, 0.06)', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid var(--brand-primary)' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.85rem', marginBottom: '4px' }}>
              Consumer Feedback / Defect Description:
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>"{ticket.description}"</p>
          </div>

          {/* AI Vision OCR & Defect Diagnostics */}
          {ticket.aiVisionAnalysis && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="var(--brand-accent)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>
                  AI Packet OCR & Defect Vision Analysis (Confidence: {Math.round(ticket.aiVisionAnalysis.confidenceScore * 100)}%)
                </span>
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {ticket.aiVisionAnalysis.annotatedFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px' }}>
                <strong>Recommendation:</strong> {ticket.aiVisionAnalysis.recommendation}
              </div>
            </div>
          )}

          {/* 8D CAPA Report if Present */}
          {ticket.capa && (
            <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="#38BDF8" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>
                  Approved 8D Corrective & Preventive Action (CAPA)
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                <strong>D5 Corrective Measure:</strong> {ticket.capa.d5_correctiveAction}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>D7 Maintenance Protocol:</strong> {ticket.capa.d7_preventiveMaintenance}
              </div>
            </div>
          )}

          {/* Customer Compensation Voucher */}
          {ticket.compensationVoucher && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.1)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Gift size={20} color="var(--status-low)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    Customer Compensation Voucher: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-accent)' }}>{ticket.compensationVoucher.code}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Value: ₹{ticket.compensationVoucher.amount} • Status: {ticket.compensationVoucher.status}
                  </div>
                </div>
              </div>
              <span className="badge badge-low">Goodwill Credited</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
