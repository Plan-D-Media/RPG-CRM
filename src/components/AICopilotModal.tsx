import React, { useState } from 'react';
import { ComplaintTicket } from '../types/crm';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: ComplaintTicket[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  complaints
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello! I am the **Too Yumm! Quality Intelligence Copilot** powered by RPG Food Safety AI. I monitor real-time plant telemetry, batch registers, consumer sentiment, and 8D CAPA workflows across all production units. \n\nHow can I assist your quality audit or customer resolution today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Analyze Batch BD26-M04-K root causes & outbreak risk',
    'Compare Haridwar (HW-01) vs Baddi (BD-02) PPM metrics',
    'Draft consumer apology letter with ₹250 Too Yumm! voucher',
    'Explain FSSAI net weight tolerance rules for 75g Karare'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = '';
      let action: string | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('bd26') || lower.includes('outbreak') || lower.includes('batch')) {
        responseText = `### 🚨 Urgent Batch Intelligence Report: **BD26-M04-K**\n\n- **Product**: Too Yumm! Karare Chilli Achari (75g Family Pack)\n- **Manufacturing Unit**: Baddi Extrusion Facility (BD-02), Multilane Packer 4\n- **Reported Incidents**: 5 confirmed consumer complaints across Mumbai, New Delhi, Pune, and Jaipur\n- **Defect Signatures**: Cross-seal thermal failure (micro-leakage) and localized charring\n- **Recall Risk Index**: **88% (CRITICAL)**\n\n**Recommendation**: Immediately issue an electronic quarantine hold across Bhiwandi, Kundli, and Zirakpur depots. Dispatch Plant QA inspection team to recalibrate Packer 4 heating cartridges.`;
        action = 'Quarantine Batch BD26-M04-K';
      } else if (lower.includes('compare') || lower.includes('plant') || lower.includes('haridwar') || lower.includes('baddi')) {
        responseText = `### 🏭 Plant Facility Benchmark Analysis\n\n1. **Haridwar Unit 1 (HW-01)**:\n   - **Current PPM**: **14.2 PPM** (Top Performer in RPG Snacks Division)\n   - **Primary Line**: Continuous Roaster & Coating Line B\n   - **SLA Adherence**: 98.4%\n\n2. **Baddi Unit 2 (BD-02)**:\n   - **Current PPM**: **38.6 PPM** (Elevated Alert Status)\n   - **Root Factor**: Thermal drift on Multilane Packer 4 sealing elements during August changeover\n   - **Corrective Action**: Upgrading to dual-zone ceramic heaters and FLIR optical inspection.\n\n3. **Hyderabad Mega-Hub (HY-03)**:\n   - **Current PPM**: **8.5 PPM** (Benchmark Grade)`;
      } else if (lower.includes('letter') || lower.includes('apology') || lower.includes('draft') || lower.includes('voucher')) {
        responseText = `### 💌 Official Consumer Resolution Letter\n\n**Subject**: Your Feedback on Too Yumm! Karare — A Personal Note from RPG Quality Care\n\n*Dear Consumer,*\n\nThank you for reaching out to us. At Too Yumm!, our guilt-free promise is built on delivering unmatched crunch, signature spice, and uncompromising quality in every single pack.\n\nWe deeply regret that your recent experience with our packet did not meet our high standards. Our Central Quality Assurance team has traced your pack to its manufacturing facility, where our automated vision systems have logged your feedback to prevent recurrence.\n\nAs a sincere token of our appreciation for helping us stay perfect, please enjoy a **₹250 Too Yumm! Snack Voucher** with redemption code **\`TY-PERFECT-CHILI-250\`** on your next order.\n\n*Warm regards,*\n**Quality Care Director**\nToo Yumm! / Guiltfree Industries (RP-Sanjiv Goenka Group)`;
        action = 'Copy Apology Template';
      } else {
        responseText = `### 📋 Quality Knowledge Response\n\nRegarding: *"${query}"*\n\n- **FSSAI & Legal Metrology Compliance**: Under Packaged Commodities Rules 2011, for pre-packaged commodities between 50g–100g, the maximum permissible error (MPE) is **4.5 grams**.\n- **Sensory & Chemical Guardrails**: Too Yumm! snacks maintain strict moisture thresholds (<2.0% for Karare, <1.8% for Veggie Stix) and Peroxide Value <1.0 meq/kg to ensure zero rancidity.\n- **Automated Routing**: All tickets logged via this portal are dispatched to the respective factory QA manager within 180 seconds.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(90deg, rgba(255, 74, 28, 0.15) 0%, rgba(17, 23, 38, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-brand)'
            }}>
              <Bot size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-display" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFF' }}>
                  Too Yumm! Quality Intelligence Copilot
                </span>
                <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>Active Telemetry</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Powered by Gemini Enterprise Core & RPG Quality Knowledge Graph
              </div>
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

        {/* Chat History */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map(m => (
            <div 
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                background: m.sender === 'user' ? 'var(--brand-gradient)' : 'rgba(15, 23, 42, 0.85)',
                color: '#FFF',
                padding: '14px 18px',
                borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '0.88rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {m.text}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', padding: '0 4px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.timestamp}</span>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.text, m.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}
                  >
                    {copiedId === m.id ? <Check size={12} color="var(--status-low)" /> : <Copy size={12} />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-accent)', fontSize: '0.82rem', padding: '8px 12px' }}>
              <Sparkles size={16} />
              <span>Analyzing plant batch data & synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Chips */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '12px'
        }}>
          <input 
            type="text"
            placeholder="Ask about batch quality, plant PPM, 8D CAPA, or consumer compensation..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="form-input"
            style={{ flex: 1, padding: '12px 16px' }}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="btn btn-primary"
            style={{ padding: '0 20px' }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
