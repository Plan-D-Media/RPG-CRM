import React, { useState } from 'react';
import { ComplaintTicket, PlantFacility, CAPA8D } from '../types/crm';
import { PLANTS_FACILITIES } from '../data/crmData';
import { 
  Building2, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sliders, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Clock
} from 'lucide-react';

interface PlantPortalProps {
  complaints: ComplaintTicket[];
  onUpdateComplaint: (updated: ComplaintTicket) => void;
  onViewDetails: (ticket: ComplaintTicket) => void;
}

export const PlantPortal: React.FC<PlantPortalProps> = ({
  complaints,
  onUpdateComplaint,
  onViewDetails
}) => {
  const [selectedPlantCode, setSelectedPlantCode] = useState<string>('BD-02');
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [isGeneratingCAPA, setIsGeneratingCAPA] = useState<boolean>(false);
  const [labMoisture, setLabMoisture] = useState<string>('1.8%');
  const [labNitrogen, setLabNitrogen] = useState<string>('99.2%');
  const [labPeroxideVal, setLabPeroxideVal] = useState<string>('0.4 meq/kg');

  const currentPlant = PLANTS_FACILITIES.find(p => p.code === selectedPlantCode) || PLANTS_FACILITIES[0];
  const plantTickets = complaints.filter(c => c.plantCode === selectedPlantCode);

  // AI 8D CAPA Generation
  const handleGenerateAiCAPA = (ticket: ComplaintTicket) => {
    setIsGeneratingCAPA(true);
    setTimeout(() => {
      setIsGeneratingCAPA(false);

      let capaResult: CAPA8D;

      if (ticket.category.includes('Packaging') || ticket.category.includes('Seal')) {
        capaResult = {
          d1_team: [`${currentPlant.qaHead}`, 'Manoj Dubey (Packaging Engineer)', 'R. K. Mishra (Plant Electrical lead)'],
          d2_problemDescription: `Cross-seal gas barrier compromise detected on batch ${ticket.batchNumber}. Nitrogen headspace depletion observed in transit.`,
          d3_containmentAction: `Quarantine current pallet stock of batch ${ticket.batchNumber} (1,200 cartons) at plant warehouse. Dispatch recall notice to regional carrying & forwarding agent.`,
          d4_rootCause5Why: [
            { why: 'Why did the packet lose nitrogen cushioning?', answer: 'Transverse fin-seal exhibited 0.25mm microscopic gap.' },
            { why: 'Why was the fin-seal incomplete?', answer: 'Sealing jaw contact temperature plummeted to 158°C (standard operating range: 175°C ± 3°C).' },
            { why: 'Why did the temperature drop?', answer: 'PID temperature controller solid-state relay (SSR) experienced intermittent switching lag.' },
            { why: 'Why was SSR malfunction undetected?', answer: 'Alarm threshold was set to a wide ±15°C hysteresis band instead of tight ±4°C band.' },
            { why: 'Root Cause?', answer: 'Firmware calibration update on Packer 4 reset temperature deviation trip interlock.' }
          ],
          d5_correctiveAction: 'Replaced SSR with Siemens industrial solid-state relay; hardcoded ±3°C PLC safety interlock to automatically divert unsealed pouches to scrap bin.',
          d6_verificationMetric: '100% vacuum chamber leak test (ASTM D3078) on 2,500 continuous pouches with 0 failures.',
          d7_preventiveMaintenance: 'Revised SOP-PKG-089: Mandate dual digital pyrometer audit before commencing each 8-hour shift.',
          d8_teamRecognition: 'Packaging line technicians awarded Zero-Defect Badge for rapid root-cause isolation.',
          aiConfidence: 0.96,
          estimatedResolutionHrs: 18
        };
      } else if (ticket.category.includes('Burnt') || ticket.category.includes('Foreign')) {
        capaResult = {
          d1_team: [`${currentPlant.qaHead}`, 'Dr. Anup Sen (Food Safety Officer)', 'Harish Rawat (Roaster Line Lead)'],
          d2_problemDescription: `Pyrolyzed organic clump in batch ${ticket.batchNumber}. Localized scorching exceeding 300°C.`,
          d3_containmentAction: 'Emergency shutdown of Roaster Zone 2. 100% optical sorting inspection on intermediate holding silos.',
          d4_rootCause5Why: [
            { why: 'Why did charred clump form?', answer: 'Excess dough piece adhered to roaster internal transfer baffle.' },
            { why: 'Why did dough adhere?', answer: 'Air knife airflow was partially deflected by seasoning dust accretion.' },
            { why: 'Why did seasoning dust accumulate?', answer: 'Exhaust suction duct static pressure dropped below 250 Pa.' },
            { why: 'Why did duct pressure drop?', answer: 'Secondary cyclone filter bag was blinded with oil mist.' },
            { why: 'Root Cause?', answer: 'Preventive filter bag change interval was set to 90 days instead of high-capacity 30 days.' }
          ],
          d5_correctiveAction: 'Installed high-efficiency PTFE-membrane filter bags and automated delta-P pressure transducer alert.',
          d6_verificationMetric: 'Zero char accumulation observed during 72-hour continuous thermal camera inspection.',
          d7_preventiveMaintenance: 'Updated Roaster Maintenance Schedule to include weekly borescope inspection of transfer baffles.',
          d8_teamRecognition: 'Sanitation & roasting engineering shift acknowledged in plant weekly meeting.',
          aiConfidence: 0.98,
          estimatedResolutionHrs: 24
        };
      } else {
        capaResult = {
          d1_team: [`${currentPlant.qaHead}`, 'Quality Control Shift Inspector', 'Maintenance Supervisor'],
          d2_problemDescription: `Net content / weight discrepancy on product SKU ${ticket.product.skuCode}.`,
          d3_containmentAction: 'Run 100% checkweigh verification on retention sample cartons.',
          d4_rootCause5Why: [
            { why: 'Why was pack underweight?', answer: 'Combination multi-head weigher dropped below target grammage.' },
            { why: 'Why did weigher underfill?', answer: 'Vibratory feeder bucket #4 had load-cell zero drift.' },
            { why: 'Why did zero drift occur?', answer: 'Mechanical vibration loosened mounting bracket bolt.' },
            { why: 'Why did bolt loosen?', answer: 'Torque specification was not verified after sanitation washdown.' },
            { why: 'Root Cause?', answer: 'Missing torque wrench verification checklist in post-cleaning SOP.' }
          ],
          d5_correctiveAction: 'Re-torqued all 14 weigher head bracket assemblies to 45 Nm; added Loctite 243 threadlocker.',
          d6_verificationMetric: 'Statistical process control (CpK) improved from 1.12 to 1.68 across 10,000 packs.',
          d7_preventiveMaintenance: 'Implemented daily pre-shift dynamic test weight calibration with certified 50g standard.',
          d8_teamRecognition: 'Weigher maintenance team commended for fast resolution.',
          aiConfidence: 0.92,
          estimatedResolutionHrs: 8
        };
      }

      const updatedTicket: ComplaintTicket = {
        ...ticket,
        status: 'CAPA_Generated',
        capa: capaResult,
        plantRemarks: `Investigation finalized by ${currentPlant.qaHead}. Retention sample lab testing (Moisture: ${labMoisture}, PV: ${labPeroxideVal}) confirmed within parameters.`
      };

      onUpdateComplaint(updatedTicket);
      setSelectedTicket(updatedTicket);
    }, 1500);
  };

  const handleSendToCQA = (ticket: ComplaintTicket) => {
    const updated: ComplaintTicket = {
      ...ticket,
      status: 'CQA_Reviewed',
      plantRemarks: `Investigation signed off by Plant QA Head. Dispatched to Corporate Quality Assurance for final governance audit.`
    };
    onUpdateComplaint(updated);
    setSelectedTicket(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Facility Header & Plant Selector */}
      <div className="glass-panel" style={{ 
        padding: '24px 30px', 
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(30, 64, 175, 0.08) 50%, rgba(17, 23, 38, 0.9) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-info">
                <Building2 size={12} /> Manufacturing Plant QA Console
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated 8D CAPA • Retention Sample Testing • Line Diagnostics</span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {currentPlant.name} ({currentPlant.code})
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
              {currentPlant.location} • <strong>QA Head:</strong> {currentPlant.qaHead}
            </p>
          </div>

          {/* Plant Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Switch Facility:
            </span>
            <select 
              value={selectedPlantCode}
              onChange={(e) => {
                setSelectedPlantCode(e.target.value);
                setSelectedTicket(null);
              }}
              className="form-select"
              style={{ width: 'auto', fontWeight: 700, borderColor: 'var(--brand-primary)' }}
            >
              {PLANTS_FACILITIES.map(plant => (
                <option key={plant.code} value={plant.code}>
                  {plant.code} — {plant.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Plant KPI Ribbons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plant Defect PPM</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: currentPlant.currentPPM > 30 ? 'var(--status-critical)' : 'var(--status-low)' }}>
              {currentPlant.currentPPM} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>PPM</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Complaints</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
              {plantTickets.length} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>Active</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit Compliance</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
              96.8% <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>FSSC 22000</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Production Lines</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              {currentPlant.lines.length} Lines Online
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side Tickets, Right Side AI 8D CAPA Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Tickets assigned to this plant */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Plant Queue ({plantTickets.length} Tickets)
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to investigate</span>
          </div>

          {plantTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={48} color="var(--status-low)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, color: '#FFF' }}>Zero Open Defects for this Plant!</div>
              <div style={{ fontSize: '0.82rem' }}>All batch lines are operating within quality tolerance.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plantTickets.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    style={{
                      background: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(0,0,0,0.35)',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.85rem' }}>
                        {t.ticketNumber}
                      </span>
                      <span className={`badge ${
                        t.severity === 'Critical' ? 'badge-critical' :
                        t.severity === 'High' ? 'badge-high' :
                        t.severity === 'Medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {t.severity}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>
                      {t.product.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Batch: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-accent)' }}>{t.batchNumber}</strong> • Mfg: {t.mfgDate}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '8px', background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px' }}>
                      "{t.description}"
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span className="badge badge-info">{t.status.replace('_', ' ')}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(t);
                          }}
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                            handleGenerateAiCAPA(t);
                          }}
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        >
                          <Sparkles size={12} />
                          <span>AI CAPA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: AI 8D CAPA & Retention Sample Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Retention Sample Testing Laboratory Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} color="var(--brand-accent)" />
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Warehouse Retention Sample Lab Validation
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Cross-check against plant retention library samples stored in climate-controlled quality rooms (22°C, 45% RH).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Moisture Content
                </label>
                <input 
                  type="text" 
                  value={labMoisture} 
                  onChange={(e) => setLabMoisture(e.target.value)}
                  className="form-input" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Nitrogen Flush Headspace
                </label>
                <input 
                  type="text" 
                  value={labNitrogen} 
                  onChange={(e) => setLabNitrogen(e.target.value)}
                  className="form-input" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Peroxide Value (PV)
                </label>
                <input 
                  type="text" 
                  value={labPeroxideVal} 
                  onChange={(e) => setLabPeroxideVal(e.target.value)}
                  className="form-input" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }} 
                />
              </div>
            </div>
          </div>

          {/* AI 8D CAPA Report Viewer */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="var(--brand-primary)" />
                <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Automated 8D CAPA & 5-Why Engine
                </h2>
              </div>

              {selectedTicket && (
                <button 
                  onClick={() => handleGenerateAiCAPA(selectedTicket)}
                  disabled={isGeneratingCAPA}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Sparkles size={14} />
                  <span>{isGeneratingCAPA ? 'Synthesizing 8D...' : 'Generate 8D Report'}</span>
                </button>
              )}
            </div>

            {selectedTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                
                {/* Active Ticket Context */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: 700 }}>
                    INVESTIGATING TICKET: {selectedTicket.ticketNumber}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>
                    {selectedTicket.product.name} — Batch {selectedTicket.batchNumber}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Reported: {selectedTicket.category} ({selectedTicket.severity})
                  </div>
                </div>

                {/* If CAPA exists */}
                {selectedTicket.capa ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
                    
                    {/* D1 & D2 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--brand-primary)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '4px' }}>
                        D2: Problem Definition
                      </div>
                      <div style={{ color: 'var(--text-main)' }}>{selectedTicket.capa.d2_problemDescription}</div>
                    </div>

                    {/* D3: Containment */}
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--status-critical)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--status-critical)', marginBottom: '4px' }}>
                        D3: Emergency Containment Action
                      </div>
                      <div style={{ color: 'var(--text-main)' }}>{selectedTicket.capa.d3_containmentAction}</div>
                    </div>

                    {/* D4: 5-Why Root Cause Tree */}
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={14} /> D4: AI 5-Why Root Cause Analysis Tree
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedTicket.capa.d4_rootCause5Why.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ 
                              background: idx === 4 ? 'var(--brand-primary)' : 'rgba(255,255,255,0.1)', 
                              color: '#FFF', 
                              fontSize: '0.7rem', 
                              fontWeight: 800, 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              minWidth: '22px',
                              textAlign: 'center'
                            }}>
                              W{idx + 1}
                            </span>
                            <div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{step.why}</span>
                              <div style={{ color: idx === 4 ? 'var(--brand-accent)' : 'var(--text-main)', fontWeight: idx === 4 ? 700 : 500 }}>
                                → {step.answer}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* D5 & D7 Corrective & Preventive */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--status-low)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--status-low)', marginBottom: '4px' }}>
                        D5 Corrective Action & D7 Preventive SOP
                      </div>
                      <div style={{ color: 'var(--text-main)' }}>{selectedTicket.capa.d5_correctiveAction}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>
                        <strong>Preventive Protocol:</strong> {selectedTicket.capa.d7_preventiveMaintenance}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--status-low)', fontWeight: 700 }}>
                        ✓ AI Confidence: {Math.round(selectedTicket.capa.aiConfidence * 100)}% • Est. Resolution: {selectedTicket.capa.estimatedResolutionHrs}h
                      </span>

                      <button 
                        onClick={() => handleSendToCQA(selectedTicket)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <Send size={14} />
                        <span>Sign Off & Submit to CQA</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <Cpu size={40} color="var(--border-medium)" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 600, color: '#FFF' }}>8D CAPA Pending</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '4px', maxWidth: '360px', margin: '4px auto 14px' }}>
                      Click <strong>"Generate 8D Report"</strong> to let the AI correlate plant PLC logs, thermal imaging, and 5-Why hypotheses.
                    </div>
                    <button 
                      onClick={() => handleGenerateAiCAPA(selectedTicket)}
                      disabled={isGeneratingCAPA}
                      className="btn btn-primary"
                    >
                      <Sparkles size={16} />
                      <span>{isGeneratingCAPA ? 'Analyzing...' : 'Generate 8D CAPA Now'}</span>
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <FileText size={48} color="var(--border-medium)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 600, color: '#FFF' }}>Select a Complaint Ticket</div>
                <div style={{ fontSize: '0.82rem' }}>Choose an active ticket from the left panel to begin plant root cause analysis.</div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
