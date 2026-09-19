import React, { useState, useRef } from 'react';
import { ComplaintTicket, ProductItem, DefectCategory, SeverityLevel } from '../types/crm';
import { PRODUCTS_CATALOG, PLANTS_FACILITIES } from '../data/crmData';
import { Download, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface AddComplaintFormProps {
  onAddComplaint: (ticket: ComplaintTicket) => void;
  onClose: () => void;
}

// Derived master data from PRODUCTS_CATALOG
const PRODUCT_CATEGORIES = [...new Set(PRODUCTS_CATALOG.map(p => p.category))];
const REGIONS = [
  'North', 'South', 'East', 'West', 'Central',
  'Delhi NCR', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
  'West Bengal', 'Telangana', 'Rajasthan', 'Gujarat', 'Uttar Pradesh'
];
const COMPLAINT_SOURCES = [
  'Consumer Helpline', 'WhatsApp', 'Email', 'Retailer / Distributor',
  'Social Media', 'Walk-in', 'Toll Free Number', 'E-Commerce Platform', 'Field Sales'
];

function getWeekLabel(date: Date): string {
  const day = date.getDate();
  if (day <= 7) return '1st Week';
  if (day <= 14) return '2nd Week';
  if (day <= 21) return '3rd Week';
  return '4th Week';
}

function calcAging(mfgDateStr: string): string {
  if (!mfgDateStr) return '';
  const mfg = new Date(mfgDateStr);
  const today = new Date();
  const diff = Math.floor((today.getTime() - mfg.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? String(diff) : '';
}

export const AddComplaintForm: React.FC<AddComplaintFormProps> = ({ onAddComplaint, onClose }) => {
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const weekLabel = getWeekLabel(today);

  const [customerName, setCustomerName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [emailId, setEmailId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [complaintSource, setComplaintSource] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [flavourVariant, setFlavourVariant] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [skuG, setSkuG] = useState('');
  const [machineNo, setMachineNo] = useState('');
  const [time24, setTime24] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [description, setDescription] = useState('');

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const img1Ref = useRef<HTMLInputElement>(null);
  const img2Ref = useRef<HTMLInputElement>(null);
  const img3Ref = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const filteredProducts = PRODUCTS_CATALOG.filter(
    p => !productCategory || p.category === productCategory
  );

  const selectedProductObj = PRODUCTS_CATALOG.find(p => p.name === productName);
  const agingDays = calcAging(mfgDate);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!customerName.trim()) errs.push('Customer Name is required');
    if (!contactNo.trim()) errs.push('Contact No. is required');
    if (!productCategory) errs.push('Product Category is required');
    if (!productName) errs.push('Product Name is required');
    if (!flavourVariant) errs.push('Flavour Variant is required');
    if (!description.trim()) errs.push('Complaint Description is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ticketNo = `TY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const prodObj = selectedProductObj || PRODUCTS_CATALOG[0];
    const plant = PLANTS_FACILITIES[0];

    const newTicket: ComplaintTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: ticketNo,
      consumerName: customerName,
      consumerPhone: contactNo,
      consumerCity: city,
      consumerState: region,
      product: {
        id: prodObj.id,
        name: prodObj.name,
        category: prodObj.category,
        flavor: flavourVariant || prodObj.flavor,
        packSize: skuG ? `${skuG}g` : prodObj.packSize,
        skuCode: prodObj.skuCode,
      },
      batchNumber: batchNo || 'N/A',
      mfgDate: mfgDate || today.toISOString().split('T')[0],
      expiryDate: '',
      plantCode: plant.code,
      manufacturingLine: machineNo || 'N/A',
      severity: 'Medium',
      category: 'Packaging Defect (Seal Leak / Deflated)' as DefectCategory,
      description,
      photoUrl: image1 ? URL.createObjectURL(image1) : undefined,
      status: 'Logged',
      createdAt: new Date().toISOString(),
      aiVisionAnalysis: {
        detectedDefect: 'Packaging Defect (Seal Leak / Deflated)',
        confidenceScore: 0.90,
        annotatedFeatures: ['Manual complaint entry', 'Pending AI verification'],
        extractedBatch: batchNo || 'N/A',
        extractedMfgDate: mfgDate,
        extractedExpiry: '',
        extractedPlantCode: plant.code,
        recommendation: 'Complaint logged manually. Pending plant QA review.'
      },
      compensationVoucher: {
        code: `TY-CARE-${Math.floor(100 + Math.random() * 900)}`,
        amount: 150,
        status: 'Pending'
      }
    };

    onAddComplaint(newTicket);
    setSubmittedTicket(ticketNo);
    setSubmitted(true);
  };

  const Label: React.FC<{ text: string; required?: boolean }> = ({ text, required }) => (
    <label style={{
      fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)',
      display: 'block', marginBottom: '5px'
    }}>
      {text}{required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
    </label>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(15, 21, 37, 0.85)',
    border: '1px solid var(--border-medium)', borderRadius: '6px',
    color: 'var(--text-main)', padding: '8px 12px',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
    outline: 'none', transition: 'border-color 0.2s ease', height: '38px',
  };

  const readonlyStyle: React.CSSProperties = {
    ...inputStyle, background: 'rgba(10, 13, 20, 0.6)',
    color: 'var(--text-muted)', cursor: 'default',
  };

  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  const fileInputWrap: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(15, 21, 37, 0.85)', border: '1px solid var(--border-medium)',
    borderRadius: '6px', padding: '6px 10px', fontSize: '0.8rem',
    cursor: 'pointer', height: '38px', overflow: 'hidden',
  };

  const chooseFileBtnStyle: React.CSSProperties = {
    background: '#4B5563', color: '#E5E7EB', border: 'none',
    borderRadius: '4px', padding: '3px 10px', fontSize: '0.75rem',
    cursor: 'pointer', flexShrink: 0, fontFamily: 'var(--font-sans)',
  };

  if (submitted && submittedTicket) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '14px', padding: '48px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CheckCircle2 size={40} color="#10B981" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>Complaint Saved Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Ticket <span style={{ color: '#10B981', fontWeight: 700 }}>#{submittedTicket}</span> has been logged and submitted to plant QA.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Back to Complaints List
          </button>
          <button
            onClick={() => { setSubmitted(false); setSubmittedTicket(null); setCustomerName(''); setContactNo(''); setEmailId(''); setAddress(''); setCity(''); setRegion(''); setComplaintSource(''); setProductCategory(''); setProductName(''); setFlavourVariant(''); setBatchNo(''); setSkuG(''); setMachineNo(''); setTime24(''); setMfgDate(''); setDescription(''); setImage1(null); setImage2(null); setImage3(null); setVideo(null); }}
            className="btn btn-secondary"
            style={{ padding: '10px 24px' }}
          >
            Add Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-display)' }}>
          Add New Complaint
          <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#EF4444', marginLeft: '10px' }}>
            (* Mandatory field)
          </span>
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF', padding: '8px 16px', fontSize: '0.82rem' }}
            onClick={() => alert('Report download feature coming soon.')}
          >
            <Download size={15} /> Download Report
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div style={{
          margin: '16px 24px 0', padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px',
          fontSize: '0.82rem', color: '#FCA5A5',
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Please fix the following:</div>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Row 1: Customer Name | Contact No | Email ID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Customer Name" required />
            <input style={inputStyle} placeholder="Enter Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
          </div>
          <div>
            <Label text="Contact no." required />
            <input style={inputStyle} placeholder="Enter 10 digit Mobile no." value={contactNo} onChange={e => setContactNo(e.target.value)} maxLength={13} required />
          </div>
          <div>
            <Label text="Email ID" />
            <input style={inputStyle} placeholder="Enter Email ID" type="email" value={emailId} onChange={e => setEmailId(e.target.value)} />
          </div>
        </div>

        {/* Row 2: Address | Complainant City | Region */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Address" />
            <input style={inputStyle} placeholder="Enter Address" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div>
            <Label text="Complainant City" />
            <input style={inputStyle} placeholder="Enter Complainant City" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div>
            <Label text="Region" />
            <select style={selectStyle} value={region} onChange={e => setRegion(e.target.value)}>
              <option value="">Select Region</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Complaint Source | Receiving Date | Week */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Complaint Source" />
            <select style={selectStyle} value={complaintSource} onChange={e => setComplaintSource(e.target.value)}>
              <option value="">Select Complaint Source</option>
              {COMPLAINT_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label text="Receiving Date" />
            <input style={readonlyStyle} value={todayStr} readOnly />
          </div>
          <div>
            <Label text="Week" />
            <input style={readonlyStyle} value={weekLabel} readOnly />
          </div>
        </div>

        {/* Row 4: Product Category | Product Name | Flavour Variant */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Product Category" required />
            <select style={selectStyle} value={productCategory} onChange={e => { setProductCategory(e.target.value); setProductName(''); setFlavourVariant(''); }} required>
              <option value="">Select Product Category</option>
              {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label text="Product Name" required />
            <select style={selectStyle} value={productName} onChange={e => { setProductName(e.target.value); setFlavourVariant(''); }} required>
              <option value="">Select Product Name</option>
              {filteredProducts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <Label text="Flavour Variant" required />
            <select style={selectStyle} value={flavourVariant} onChange={e => setFlavourVariant(e.target.value)} required>
              <option value="">Select Flavour Variant</option>
              {selectedProductObj
                ? <option value={selectedProductObj.flavor}>{selectedProductObj.flavor}</option>
                : filteredProducts.map(p => <option key={p.id} value={p.flavor}>{p.flavor}</option>)
              }
            </select>
          </div>
        </div>

        {/* Row 5: Batch No. | SKU (g) | Machine No. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Batch No." />
            <input style={inputStyle} placeholder="Enter Batch No." value={batchNo} onChange={e => setBatchNo(e.target.value)} />
          </div>
          <div>
            <Label text="SKU (g)" />
            <input style={inputStyle} placeholder="Enter SKU (g)" value={skuG} onChange={e => setSkuG(e.target.value)} type="number" min="0" />
          </div>
          <div>
            <Label text="Machine No." />
            <input style={inputStyle} placeholder="Enter Machine No." value={machineNo} onChange={e => setMachineNo(e.target.value)} />
          </div>
        </div>

        {/* Row 6: Time | Mfg. Date | Aging */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <Label text="Time (24 Hours)" />
            <input style={inputStyle} placeholder="Enter Time (24 Hours)" value={time24} onChange={e => setTime24(e.target.value)} type="time" />
          </div>
          <div>
            <Label text="Mfg. Date" />
            <input style={inputStyle} value={mfgDate} onChange={e => setMfgDate(e.target.value)} type="date" />
          </div>
          <div>
            <Label text="Aging (Days)" />
            <input style={readonlyStyle} value={agingDays ? `${agingDays} days` : ''} placeholder="Auto-calculated" readOnly />
          </div>
        </div>

        {/* Row 7: File Uploads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          {[
            { label: 'Upload Image 1', ref: img1Ref, file: image1, setter: setImage1, accept: 'image/*' },
            { label: 'Upload Image 2', ref: img2Ref, file: image2, setter: setImage2, accept: 'image/*' },
            { label: 'Upload Image 3', ref: img3Ref, file: image3, setter: setImage3, accept: 'image/*' },
            { label: 'Upload Video (Size not more than 1MB)', ref: vidRef, file: video, setter: setVideo, accept: 'video/*' },
          ].map(({ label, ref, file, setter, accept }, idx) => (
            <div key={idx}>
              <Label text={label} />
              <div style={fileInputWrap} onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}>
                <button type="button" style={chooseFileBtnStyle}>Choose File</button>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file ? (file as File).name : 'No file chosen'}
                </span>
                <input
                  ref={ref as React.RefObject<HTMLInputElement>}
                  type="file"
                  accept={accept}
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (accept === 'video/*' && f && f.size > 1024 * 1024) {
                      alert('Video size must be 1MB or less.');
                      return;
                    }
                    setter(f || null);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Row 8: Complaint Description */}
        <div>
          <Label text="Complaint Description" required />
          <textarea
            style={{ ...inputStyle, height: '120px', resize: 'vertical', lineHeight: '1.5' } as React.CSSProperties}
            placeholder="Enter Complaint Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFF', border: 'none', borderRadius: '8px',
              padding: '10px 32px', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            }}
          >
            <CheckCircle2 size={17} /> SAVE
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};
