import React, { useState } from 'react';
import { ComplaintTicket, ProductItem, DefectCategory, SeverityLevel, DefectVisionAnalysis } from '../types/crm';
import { PRODUCTS_CATALOG, PLANTS_FACILITIES, SAMPLE_DEFECT_SCENARIOS } from '../data/crmData';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  Gift, 
  Barcode, 
  Zap, 
  Clock, 
  MapPin, 
  Layers,
  ArrowRight,
  Mic,
  MicOff,
  ShieldCheck,
  Volume2,
  FileCheck
} from 'lucide-react';

interface CustomerPortalProps {
  complaints: ComplaintTicket[];
  onAddComplaint: (ticket: ComplaintTicket) => void;
  onViewDetails: (ticket: ComplaintTicket) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  complaints,
  onAddComplaint,
  onViewDetails
}) => {
  // Form State
  const [consumerName, setConsumerName] = useState('Ananya Sen');
  const [consumerPhone, setConsumerPhone] = useState('+91 98301 55678');
  const [consumerCity, setConsumerCity] = useState('Kolkata');
  const [consumerState, setConsumerState] = useState('West Bengal');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS_CATALOG[0]);
  const [batchNumber, setBatchNumber] = useState('BD26-M04-K');
  const [mfgDate, setMfgDate] = useState('2026-08-14');
  const [expiryDate, setExpiryDate] = useState('2027-02-14');
  const [plantCode, setPlantCode] = useState('BD-02');
  const [category, setCategory] = useState<DefectCategory>('Packaging Defect (Seal Leak / Deflated)');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [description, setDescription] = useState('Purchased from Spencers Supermarket. Packet was completely deflated without nitrogen gas, Karare snacks tasted stale.');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80');
  
  // AI Vision & Voice States
  const [isScanning, setIsScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<DefectVisionAnalysis | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceDetectedText, setVoiceDetectedText] = useState<string | null>(null);
  const [fraudScore, setFraudScore] = useState<{ isGenuine: boolean; score: number; details: string }>({
    isGenuine: true,
    score: 98.4,
    details: 'Verified unique photo hash. Phone number has 0 prior voucher claims. Low abuse probability.'
  });

  // AI Voice Complaint Simulation (Hindi/English)
  const handleSimulateVoice = (lang: 'hi' | 'en') => {
    setIsVoiceRecording(true);
    setVoiceDetectedText('Listening to consumer audio stream / WhatsApp voice note...');
    
    setTimeout(() => {
      setIsVoiceRecording(false);
      if (lang === 'hi') {
        const hindiSpeech = '“Bhaiya D-Mart Mumbai se Too Yumm Karare Chilli Achari packet liya tha. Poora packet pichka hua tha, bilkul nitrogen hawa nahi thi aur andar ke snacks stale ho gaye the. Batch number BD26 hai.”';
        setVoiceDetectedText(hindiSpeech);
        setConsumerCity('Mumbai');
        setConsumerState('Maharashtra');
        setSelectedProduct(PRODUCTS_CATALOG[0]);
        setBatchNumber('BD26-M04-K');
        setCategory('Packaging Defect (Seal Leak / Deflated)');
        setSeverity('High');
        setDescription('Voice Note Transcribed [Hindi]: Packet was completely deflated with zero nitrogen gas. Stale taste.');
      } else {
        const engSpeech = '“Hi, I bought a 70g pack of Bhoot Karare from Spencer’s in New Delhi. Inside, I discovered a burnt blackened chunk that smelled scorched and inedible. Batch BD26-M04-K.”';
        setVoiceDetectedText(engSpeech);
        setConsumerCity('New Delhi');
        setConsumerState('Delhi NCR');
        setSelectedProduct(PRODUCTS_CATALOG[5]);
        setBatchNumber('BD26-M04-K');
        setCategory('Burnt / Overcooked / Color Anomaly');
        setSeverity('Critical');
        setDescription('Voice Note Transcribed [English]: Found burnt carbonized chunk inside pack. Severe scorched odor.');
      }
    }, 1500);
  };

  // Quick Preset Simulator
  const handleLoadPreset = (scenario: typeof SAMPLE_DEFECT_SCENARIOS[0]) => {
    setSelectedProduct(scenario.product);
    setBatchNumber(scenario.batch);
    setPlantCode(scenario.plant);
    setCategory(scenario.category);
    setSeverity(scenario.severity);
    setDescription(scenario.description);
    setImageUrl(scenario.imgUrl);
    setAiScanResult(null);
  };

  // Run AI Defect Scan
  const handleRunAiDefectScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      let defect = category;
      let features = ['Cross-seal thermal seal integrity compromised', 'Micro-perforation near notch', 'Zero nitrogen gas retention'];
      let sev: SeverityLevel = 'High';

      if (category.includes('Burnt') || category.includes('Foreign')) {
        features = ['Pyrolyzed carbonized organic clump detected', 'High localized heat exposure >320°C', 'Food safety risk: Level 1'];
        sev = 'Critical';
      } else if (category.includes('Underweight')) {
        features = ['Digital checkweigher variance -18.2%', 'Tare differential observed'];
        sev = 'Medium';
      }

      setSeverity(sev);
      setAiScanResult({
        detectedDefect: defect,
        confidenceScore: 0.97,
        annotatedFeatures: features,
        extractedBatch: batchNumber,
        extractedMfgDate: mfgDate,
        extractedExpiry: expiryDate,
        extractedPlantCode: plantCode,
        recommendation: `Auto-routed to Plant ${plantCode} investigation team with Priority: ${sev}. Auto-generated 8D containment triggered.`
      });
    }, 1400);
  };

  // Submit Complaint
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `tkt-${Date.now()}`;
    const ticketNo = `TY-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: ComplaintTicket = {
      id: newId,
      ticketNumber: ticketNo,
      consumerName,
      consumerPhone,
      consumerCity,
      consumerState,
      product: selectedProduct,
      batchNumber,
      mfgDate,
      expiryDate,
      plantCode,
      manufacturingLine: 'Line A (High-Speed Packer)',
      severity,
      category,
      description,
      photoUrl: imageUrl,
      status: 'AI_Triaged',
      createdAt: new Date().toISOString(),
      aiVisionAnalysis: aiScanResult || {
        detectedDefect: category,
        confidenceScore: 0.95,
        annotatedFeatures: ['Automated packet analysis verified', 'Cross-referenced with batch register'],
        extractedBatch: batchNumber,
        extractedMfgDate: mfgDate,
        extractedExpiry: expiryDate,
        extractedPlantCode: plantCode,
        recommendation: 'Auto-triaged by Too Yumm! Quality Intelligence Engine.'
      },
      compensationVoucher: {
        code: `TY-PERFECT-${Math.floor(100 + Math.random() * 900)}`,
        amount: severity === 'Critical' ? 500 : severity === 'High' ? 250 : 150,
        status: 'Issued'
      }
    };

    onAddComplaint(newTicket);
    setSubmittedSuccess(ticketNo);
    setTimeout(() => setSubmittedSuccess(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner / Value Proposition */}
      <div className="glass-panel" style={{ 
        padding: '24px 30px', 
        background: 'linear-gradient(135deg, rgba(255, 74, 28, 0.12) 0%, rgba(225, 29, 72, 0.08) 50%, rgba(17, 23, 38, 0.9) 100%)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-high">
                <Sparkles size={12} /> AI Consumer Experience Engine
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant OCR • Automated 8D Routing • Smart Compensation</span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              AI Consumer Complaint & Defect Intake
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.9rem', marginTop: '4px' }}>
              Upload snack pouch photos or select live simulated defect samples. The Too Yumm! AI engine automatically reads printed batch details, grades defect severity, alerts plant quality heads, and generates instant resolution vouchers.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ One-Click Test Scenarios:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_DEFECT_SCENARIOS.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(sc)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Zap size={13} color="var(--brand-accent)" />
                  <span>{sc.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submittedSuccess && (
        <div className="glass-panel" style={{ 
          padding: '16px 20px', 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid var(--status-low)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          animation: 'pulseGlow 2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} color="var(--status-low)" />
            <div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>
                Ticket #{submittedSuccess} Successfully Logged & AI-Triaged!
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Plant QA dispatched investigation alert. Consumer received instant SMS with compensation coupon.
              </div>
            </div>
          </div>
          <span className="badge badge-low">Assigned to Plant</span>
        </div>
      )}

      {/* Two-Column Grid: Form on Left, Vision Scanner on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Complaint Details Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={20} color="var(--brand-primary)" />
              <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Complaint Parameters & Consumer Profile
              </h2>
            </div>
            
            {/* AI Voice Note Intake Controls */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--brand-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mic size={13} /> Voice AI:
              </span>
              <button
                type="button"
                onClick={() => handleSimulateVoice('hi')}
                disabled={isVoiceRecording}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem', borderColor: 'var(--border-medium)' }}
                title="Simulate WhatsApp Hindi Voice Note"
              >
                🇮🇳 Hindi Voice Note
              </button>
              <button
                type="button"
                onClick={() => handleSimulateVoice('en')}
                disabled={isVoiceRecording}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem', borderColor: 'var(--border-medium)' }}
                title="Simulate English Phone Dictation"
              >
                🇬🇧 English Voice
              </button>
            </div>
          </div>

          {/* Voice Detection Live Banner */}
          {isVoiceRecording && (
            <div style={{ padding: '10px 14px', background: 'rgba(255, 74, 28, 0.15)', borderRadius: '8px', border: '1px solid var(--brand-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#FFF' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulseGlow 1s infinite' }} />
              <span>Transcribing audio & extracting SKU, Batch, and Defect sentiment...</span>
            </div>
          )}

          {voiceDetectedText && (
            <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid #10B981', marginBottom: '14px', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--status-low)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Volume2 size={13} /> Audio Transcribed & Form Auto-Populated:
              </div>
              <div style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>{voiceDetectedText}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Consumer Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Consumer Full Name
                </label>
                <input 
                  type="text" 
                  value={consumerName} 
                  onChange={(e) => setConsumerName(e.target.value)} 
                  required 
                  className="form-input" 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Phone / WhatsApp
                </label>
                <input 
                  type="text" 
                  value={consumerPhone} 
                  onChange={(e) => setConsumerPhone(e.target.value)} 
                  required 
                  className="form-input" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  City
                </label>
                <input 
                  type="text" 
                  value={consumerCity} 
                  onChange={(e) => setConsumerCity(e.target.value)} 
                  required 
                  className="form-input" 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  State / Territory
                </label>
                <input 
                  type="text" 
                  value={consumerState} 
                  onChange={(e) => setConsumerState(e.target.value)} 
                  required 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Product Selector */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Too Yumm! Product SKU
              </label>
              <select 
                value={selectedProduct.id} 
                onChange={(e) => {
                  const p = PRODUCTS_CATALOG.find(x => x.id === e.target.value);
                  if (p) setSelectedProduct(p);
                }} 
                className="form-select"
              >
                {PRODUCTS_CATALOG.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.packSize} ({p.skuCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Batch & Manufacturing Parameters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Batch Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Barcode size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-accent)' }} />
                  <input 
                    type="text" 
                    value={batchNumber} 
                    onChange={(e) => setBatchNumber(e.target.value)} 
                    required 
                    className="form-input" 
                    style={{ paddingLeft: '32px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Plant Facility
                </label>
                <select 
                  value={plantCode} 
                  onChange={(e) => setPlantCode(e.target.value)} 
                  className="form-select"
                >
                  {PLANTS_FACILITIES.map(plant => (
                    <option key={plant.code} value={plant.code}>
                      {plant.code} ({plant.name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Mfg Date
                </label>
                <input 
                  type="date" 
                  value={mfgDate} 
                  onChange={(e) => setMfgDate(e.target.value)} 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Defect Category & Severity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Defect Category
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as DefectCategory)} 
                  className="form-select"
                >
                  <option value="Packaging Defect (Seal Leak / Deflated)">Packaging Defect (Seal Leak / Deflated)</option>
                  <option value="Foreign Matter / Contaminant">Foreign Matter / Contaminant</option>
                  <option value="Burnt / Overcooked / Color Anomaly">Burnt / Overcooked / Color Anomaly</option>
                  <option value="Taste / Rancidity / Oil Off-Odor">Taste / Rancidity / Oil Off-Odor</option>
                  <option value="Underweight / Net Content Discrepancy">Underweight / Net Content Discrepancy</option>
                  <option value="Seasoning Imbalance / Missing Spices">Seasoning Imbalance / Missing Spices</option>
                  <option value="Puffiness / Gas Swelling">Puffiness / Gas Swelling</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Assigned Severity
                </label>
                <select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)} 
                  className="form-select"
                >
                  <option value="Critical">Critical (P0 Hazard)</option>
                  <option value="High">High (P1 Plant Alert)</option>
                  <option value="Medium">Medium (P2 Quality)</option>
                  <option value="Low">Low (P3 Cosmetic)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Customer Description / Sensory Notes
              </label>
              <textarea 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                className="form-textarea" 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '1rem', marginTop: '6px' }}>
              <CheckCircle2 size={18} />
              <span>Submit & Dispatch AI Quality Ticket</span>
            </button>

          </form>
        </div>

        {/* Right Column: AI Computer Vision & Packet OCR Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--brand-accent)" />
                <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  AI Packet OCR & Defect Vision Inspector
                </h2>
              </div>
              <button 
                onClick={handleRunAiDefectScan}
                disabled={isScanning}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} />
                <span>{isScanning ? 'Analyzing Pouch...' : 'Run Live AI Scan'}</span>
              </button>
            </div>

            {/* Image Preview Box with Scanning Laser */}
            <div style={{ 
              position: 'relative', 
              height: '240px', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              background: '#000',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={imageUrl} 
                alt="Defect Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
              />
              
              {isScanning && <div className="scanning-laser" />}

              {/* Overlay HUD Tags */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFF', border: '1px solid var(--brand-primary)' }}>
                  BATCH: {batchNumber}
                </span>
                <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--brand-accent)' }}>
                  PLANT: {plantCode}
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                <span className={`badge ${
                  severity === 'Critical' ? 'badge-critical' :
                  severity === 'High' ? 'badge-high' :
                  severity === 'Medium' ? 'badge-medium' : 'badge-low'
                }`}>
                  SEVERITY: {severity}
                </span>
              </div>
            </div>

            {/* AI Analysis Output */}
            <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-subtle)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> AI Diagnostic Telemetry
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--status-low)', fontWeight: 700 }}>
                  Confidence: 97.4%
                </span>
              </div>

              {aiScanResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    Detected Defect: <span style={{ color: 'var(--brand-primary)' }}>{aiScanResult.detectedDefect}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Extracted Visual Signatures:</span>
                    <ul style={{ paddingLeft: '18px', marginTop: '4px', color: 'var(--text-main)' }}>
                      {aiScanResult.annotatedFeatures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255, 74, 28, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 74, 28, 0.25)', marginTop: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>Next Best Action: </span>
                    <span style={{ color: 'var(--text-main)' }}>{aiScanResult.recommendation}</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '16px 0' }}>
                  Click <strong>Run Live AI Scan</strong> to extract package OCR, seal micro-crack diagnostics, and auto-populate investigation parameters.
                </div>
              )}
            </div>

          </div>

          {/* AI Fraud & Duplicate Claim Abuse Radar */}
          <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#38BDF8" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFF' }}>
                  AI Fraud & Image Duplicate Radar
                </span>
              </div>
              <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                Authenticity: {fraudScore.score}%
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {fraudScore.details}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--status-low)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                ✓ Zero Reverse-Image Match
              </span>
              <span style={{ color: 'var(--status-low)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                ✓ EXIF Camera Verified
              </span>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '18px 22px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 23, 38, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift size={20} color="var(--status-low)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Automatic Consumer Happiness Coupon</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Auto-dispatched via SMS: <span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>₹250 Snack Box Voucher</span>
                  </div>
                </div>
              </div>
              <span className="badge badge-low">Instant Goodwill</span>
            </div>
          </div>

        </div>

      </div>

      {/* Real-Time Tickets Logged */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Recent Consumer Quality Complaints ({complaints.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Live intake pipeline feeding directly into Plant QA and CQA Corporate dashboards.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-critical">Critical: {complaints.filter(c => c.severity === 'Critical').length}</span>
            <span className="badge badge-high">High: {complaints.filter(c => c.severity === 'High').length}</span>
            <span className="badge badge-medium">Medium: {complaints.filter(c => c.severity === 'Medium').length}</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>Ticket #</th>
                <th style={{ padding: '12px 8px' }}>Product & Flavor</th>
                <th style={{ padding: '12px 8px' }}>Batch / Plant</th>
                <th style={{ padding: '12px 8px' }}>Consumer & City</th>
                <th style={{ padding: '12px 8px' }}>Category</th>
                <th style={{ padding: '12px 8px' }}>Severity</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-primary)' }}>
                    {t.ticketNumber}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 600 }}>{t.product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.product.flavor}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{t.batchNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plant: {t.plantCode}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div>{t.consumerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.consumerCity}, {t.consumerState}</div>
                  </td>
                  <td style={{ padding: '12px 8px', maxWidth: '200px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.category}
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${
                      t.severity === 'Critical' ? 'badge-critical' :
                      t.severity === 'High' ? 'badge-high' :
                      t.severity === 'Medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {t.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="badge badge-info">{t.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onViewDetails(t)}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
