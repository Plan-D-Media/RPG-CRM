import React, { useState } from 'react';
import { ComplaintTicket, OutbreakAlert } from '../types/crm';
import { PLANTS_FACILITIES, ACTIVE_OUTBREAKS } from '../data/crmData';
import { 
  ShieldAlert, 
  Flame, 
  TrendingDown, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle, 
  MapPin, 
  Building2, 
  BarChart3, 
  Sparkles,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  FileText,
  Copy,
  Printer,
  X
} from 'lucide-react';

interface CQAPortalProps {
  complaints: ComplaintTicket[];
  outbreaks: OutbreakAlert[];
  onUpdateComplaint: (updated: ComplaintTicket) => void;
  onViewDetails: (ticket: ComplaintTicket) => void;
}

export const CQAPortal: React.FC<CQAPortalProps> = ({
  complaints,
  outbreaks,
  onUpdateComplaint,
  onViewDetails
}) => {
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakAlert | null>(outbreaks[0] || null);
  const [quarantinedBatches, setQuarantinedBatches] = useState<string[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [fssaiNoticeBatch, setFssaiNoticeBatch] = useState<OutbreakAlert | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Handle Quarantine Action
  const handleQuarantine = (batchNo: string) => {
    if (!quarantinedBatches.includes(batchNo)) {
      setQuarantinedBatches([...quarantinedBatches, batchNo]);
    }
  };

  const filteredTickets = complaints.filter(t => {
    if (filterSeverity === 'All') return true;
    return t.severity === filterSeverity;
  });

  const totalComplaints = complaints.length;
  const criticalCount = complaints.filter(c => c.severity === 'Critical').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'CQA_Reviewed').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Top CQA Command Center Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px 30px', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 50%, rgba(17, 23, 38, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-low">
                <ShieldAlert size={12} /> CQA Apex Governance Portal
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Corporate Quality Assurance • RP-Sanjiv Goenka Group</span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Central Quality Command Center
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              Cross-facility quality governance, statistical PPM tracking, automated batch recall risk analysis, and corporate CAPA sign-off.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-subtle)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FSSAI Regulatory Posture</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-low)' }}>
                100% Compliant
              </div>
            </div>
          </div>
        </div>

        {/* Global Executive KPIs */}
        <div className="grid-kpi" style={{ marginTop: '22px', marginBottom: '0' }}>
          <div className="kpi-card glass-panel" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SYSTEM DEFECT RATE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>18.4</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PPM (Target &lt; 25)</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--status-low)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={14} /> 12.3% reduction vs Q2
            </div>
          </div>

          <div className="kpi-card glass-panel" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CRITICAL ESCALATIONS (P0)</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-critical)' }}>{criticalCount}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Under Active Review</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--status-high)' }}>
              1 Batch on Precautionary Hold
            </div>
          </div>

          <div className="kpi-card glass-panel" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CAPA RESOLUTION RATE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-accent)' }}>{resolutionRate}%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Closed within SLA</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--status-low)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> Avg turnaround: 16.4 hrs
            </div>
          </div>

          <div className="kpi-card glass-panel" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL LOGGED COMPLAINTS</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>{totalComplaints}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tickets</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              100% AI-Triaged with OCR
            </div>
          </div>
        </div>
      </div>

      {/* Real-time AI Batch Outbreak Radar & Recall Risk Analyzer */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              background: 'rgba(239, 68, 68, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AlertOctagon size={22} color="var(--status-critical)" />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                AI Outbreak & Batch Contamination Radar
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Statistical anomaly detection identifying geographic clusters across wholesale depots and retail markets.
              </div>
            </div>
          </div>
          <span className="badge badge-critical animate-pulse-glow">
            {outbreaks.length} Active Anomaly Alerts
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {outbreaks.map(item => {
            const isQuarantined = quarantinedBatches.includes(item.batchNumber);
            return (
              <div 
                key={item.id} 
                style={{ 
                  background: 'rgba(0,0,0,0.4)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  border: item.riskScore > 75 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(251, 191, 36, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 800, 
                    fontSize: '1rem', 
                    color: 'var(--brand-accent)' 
                  }}>
                    BATCH #{item.batchNumber}
                  </span>
                  <span className={`badge ${item.riskScore > 75 ? 'badge-critical' : 'badge-medium'}`}>
                    Recall Risk: {item.riskScore}%
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>
                  {item.productName}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Origin: <strong>{item.plantCode}</strong> • Incidents: <strong>{item.incidentCount} reports</strong>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    AFFECTED GEOGRAPHIC MARKETS:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {item.affectedCities.map(city => (
                      <span key={city} style={{ 
                        background: 'rgba(255, 74, 28, 0.15)', 
                        color: 'var(--brand-primary)', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={10} /> {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    AI Recommendation: <strong style={{ color: '#FFF' }}>{item.recommendation}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setFssaiNoticeBatch(item)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--brand-primary)', color: 'var(--brand-accent)' }}
                    >
                      <FileText size={14} />
                      <span>AI FSSAI Recall Notice</span>
                    </button>

                    {isQuarantined ? (
                      <span className="badge badge-low" style={{ padding: '6px 12px' }}>
                        <CheckCircle size={14} /> Batch Quarantined
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleQuarantine(item.batchNumber)}
                        className="btn btn-danger"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        <AlertOctagon size={14} />
                        <span>Issue National Hold</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Plant Benchmark Matrix & Filterable Complaints Registry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Plant Facilities Benchmark Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--brand-primary)" />
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Plant Quality Scorecard & PPM Index
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live telemetry</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PLANTS_FACILITIES.map(plant => (
              <div 
                key={plant.code}
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>{plant.name}</span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--brand-accent)', fontSize: '0.7rem' }}>
                      {plant.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {plant.location} • Lead: {plant.qaHead}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 800, 
                    color: plant.currentPPM > 30 ? 'var(--status-critical)' : 'var(--status-low)' 
                  }}>
                    {plant.currentPPM} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PPM</span>
                  </div>
                  <span className={`badge ${
                    plant.status === 'Normal' ? 'badge-low' :
                    plant.status === 'Warning' ? 'badge-critical' : 'badge-medium'
                  }`}>
                    {plant.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Corporate Quality Governance Queue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Corporate Governance Registry ({filteredTickets.length})
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Final sign-off on 8D CAPAs & food safety audits
              </div>
            </div>

            {/* Severity Filter */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Critical', 'High', 'Medium'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterSeverity(lvl)}
                  style={{
                    background: filterSeverity === lvl ? 'var(--brand-primary)' : 'rgba(255,255,255,0.08)',
                    color: filterSeverity === lvl ? '#FFF' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredTickets.map(t => (
              <div 
                key={t.id}
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.8rem' }}>
                      {t.ticketNumber}
                    </span>
                    <span className={`badge ${
                      t.severity === 'Critical' ? 'badge-critical' :
                      t.severity === 'High' ? 'badge-high' :
                      t.severity === 'Medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {t.severity}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Batch: {t.batchNumber}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFF', marginTop: '4px' }}>
                    {t.product.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Plant: {t.plantCode} • City: {t.consumerCity}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => onViewDetails(t)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Audit
                  </button>

                  {t.status !== 'Resolved' && (
                    <button
                      onClick={() => {
                        const updated: ComplaintTicket = {
                          ...t,
                          status: 'Resolved',
                          cqaNotes: 'CQA Final Sign-off approved. Quality standards reaffirmed.'
                        };
                        onUpdateComplaint(updated);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Sign-Off
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI FSSAI Regulatory Notice Modal */}
      {fssaiNoticeBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '750px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.98)',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#EF4444" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF' }}>
                    FSSAI Schedule 4 Regulatory Notice Draft
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Generated under Food Safety & Standards (Food Recall Procedure) Regulations, 2017
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setFssaiNoticeBatch(null)}
                className="btn btn-secondary"
                style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: 'var(--text-main)', maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', lineHeight: 1.6 }}>
                <strong>FORM G — STATUTORY FOOD RECALL NOTICE</strong><br />
                <strong>To:</strong> The Designated Officer, Food Safety & Standards Authority of India (FSSAI)<br />
                <strong>Food Business Operator (FBO):</strong> Guiltfree Industries Limited (RP-Sanjiv Goenka Group)<br />
                <strong>Central FSSAI License Number:</strong> 10017031002079<br /><br />
                <strong>1. Product Identification:</strong><br />
                • Brand & SKU: {fssaiNoticeBatch.productName}<br />
                • Batch Affected: <code>{fssaiNoticeBatch.batchNumber}</code><br />
                • Manufacturing Facility: {fssaiNoticeBatch.plantCode}<br /><br />
                <strong>2. Defect / Contaminant Nature:</strong><br />
                • Cross-seal failure resulting in loss of modified atmosphere nitrogen barrier.<br />
                • Multi-city incident cluster confirmed in {fssaiNoticeBatch.affectedCities.join(', ')}.<br /><br />
                <strong>3. Corrective & Containment Action Executed:</strong><br />
                • Wholesale depot hold issued across Bhiwandi, Kundli, and Zirakpur warehouses.<br />
                • Packaging line heat-seal thermocouple recalibrated with dual-zone ceramic heaters.<br />
                • Zero consumer health hazards reported; advisory issued as precautionary quality compliance.<br /><br />
                <strong>Authorized Signatory:</strong> Corporate Quality Assurance Director, RP-Sanjiv Goenka Group
              </div>
            </div>

            <div style={{ padding: '14px 20px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-low)', fontWeight: 600 }}>
                ✓ AI Certified: Compliant with FSSAI Recall Guidelines
              </span>

              <button
                onClick={() => {
                  setCopiedNotice(true);
                  navigator.clipboard.writeText(`FORM G - STATUTORY FOOD RECALL NOTICE\nFBO: Guiltfree Industries Limited (RP-Sanjiv Goenka Group)\nFSSAI Lic: 10017031002079\nProduct: ${fssaiNoticeBatch.productName}\nBatch: ${fssaiNoticeBatch.batchNumber}\nStatus: Wholesale depot hold executed.`);
                  setTimeout(() => setCopiedNotice(false), 2500);
                }}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Copy size={14} />
                <span>{copiedNotice ? 'Copied to Clipboard!' : 'Copy Official Notice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
