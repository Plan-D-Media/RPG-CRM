import React, { useState } from 'react';
import { 
  Download, 
  PlusCircle, 
  Search, 
  ClipboardList, 
  Calendar, 
  Building, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ComplaintTicket } from '../types/crm';

interface DashboardChartsProps {
  onNewComplaintClick: () => void;
  complaints: ComplaintTicket[];
}

interface ChartSlice {
  label: string;
  value: number;
  color: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  onNewComplaintClick,
  complaints
}) => {
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-09-17');
  const [selectedPlant, setSelectedPlant] = useState('All');
  const [hoveredSlice, setHoveredSlice] = useState<{ chartId: string; label: string; value: number } | null>(null);

  // Plants list from Screenshot 4
  const plantOptions = [
    'All Plants',
    'Geeta Snacks & Savouries',
    'GKP Snacks Industries',
    'Pampar Foods Pvt Ltd',
    'Badshah Extrusion Plant',
    'Atop Foods Co-Packer',
    'Patwari Foods Facility',
    'GRTS Manufacturing Hub',
    'Devarpan Foods Ltd',
    'Haridwar SIDCUL Unit 1',
    'Baddi Extrusion Unit 2'
  ];

  // Dynamic calculations or realistic defaults from Screenshot 4
  const closedCount = 244;
  const wipCount = 695;
  const totalCount = closedCount + wipCount; // 939

  // 1. Customer Connected For (Screenshot 4)
  const connectedForData: ChartSlice[] = [
    { label: 'Complaint', value: 79.3, color: '#3B82F6' },
    { label: 'Feedback', value: 9.7, color: '#EF4444' },
    { label: 'Appreciation', value: 4.2, color: '#F59E0B' },
    { label: 'Query', value: 2.8, color: '#10B981' },
    { label: 'Complaint-Toy', value: 1.8, color: '#8B5CF6' },
    { label: 'False Complaint', value: 1.1, color: '#06B6D4' },
    { label: 'Expired Product', value: 0.7, color: '#BE185D' },
    { label: 'Other', value: 0.4, color: '#9CA3AF' }
  ];

  // 2. Product Category Wise (Screenshot 4)
  const categoryWiseData: ChartSlice[] = [
    { label: 'Potato Chips', value: 57.8, color: '#2563EB' },
    { label: 'Extruded Snacks', value: 20.7, color: '#EA580C' },
    { label: 'Indian Ethnic', value: 15.7, color: '#FBBF24' },
    { label: 'Noodle', value: 3.4, color: '#16A34A' },
    { label: 'Premium Chips', value: 2.4, color: '#9333EA' }
  ];

  // 3. Product Wise (Screenshot 4)
  const productWiseData: ChartSlice[] = [
    { label: 'Potato Chips', value: 54.4, color: '#3B82F6' },
    { label: 'Karare', value: 9.6, color: '#EF4444' },
    { label: 'Multigrain Chips', value: 8.2, color: '#F97316' },
    { label: 'Bikaneri Bhujia', value: 7.1, color: '#10B981' },
    { label: 'Wafers', value: 6.4, color: '#8B5CF6' },
    { label: 'Salted Peanut', value: 5.2, color: '#EC4899' },
    { label: 'Tasty Nut', value: 4.8, color: '#14B8A6' },
    { label: 'All In One', value: 4.3, color: '#A855F7' }
  ];

  // 4. Customer Response Action Status (Screenshot 4: Closed 26%, WIP 74%)
  const actionStatusData: ChartSlice[] = [
    { label: 'Closed', value: 26.0, color: '#2563EB' },
    { label: 'WIP', value: 74.0, color: '#DC2626' }
  ];

  // 5. Customer Complaint - Region Wise (Screenshot 4)
  const regionWiseData: ChartSlice[] = [
    { label: 'South', value: 26.6, color: '#2563EB' },
    { label: 'North', value: 26.4, color: '#DC2626' },
    { label: 'West', value: 26.4, color: '#F59E0B' },
    { label: 'East', value: 14.9, color: '#7C3AED' }
  ];

  // 6. Customer Response Nature (Screenshot 4)
  const responseNatureData: ChartSlice[] = [
    { label: 'Product Quality (Sensorial)', value: 60.8, color: '#DB2777' },
    { label: 'Food Safety', value: 17.4, color: '#2563EB' },
    { label: 'Packaging', value: 12.7, color: '#F59E0B' },
    { label: 'Legal Metrology', value: 5.2, color: '#16A34A' },
    { label: 'Other', value: 3.9, color: '#9CA3AF' }
  ];

  // 7. Plant wise Complaint (Screenshot 4)
  const plantWiseData: ChartSlice[] = [
    { label: 'GKP Snacks', value: 19.3, color: '#F97316' },
    { label: 'Pampar', value: 16.1, color: '#16A34A' },
    { label: 'Geeta', value: 14.4, color: '#3B82F6' },
    { label: 'Badshah', value: 12.0, color: '#DC2626' },
    { label: 'Atop Foods', value: 9.3, color: '#8B5CF6' },
    { label: 'Patwari Foods', value: 8.5, color: '#EC4899' },
    { label: 'GRTS', value: 8.1, color: '#EAB308' },
    { label: 'Devarpan Foods', value: 7.3, color: '#06B6D4' },
    { label: 'Haridwar / Baddi', value: 5.0, color: '#6366F1' }
  ];

  // Export CSV Report
  const handleDownloadReport = () => {
    const headers = ['Ticket Number', 'Consumer Name', 'Product', 'Batch', 'Plant', 'Severity', 'Category', 'Status', 'Date'];
    const rows = complaints.map(c => [
      c.ticketNumber,
      `"${c.consumerName}"`,
      `"${c.product.name}"`,
      c.batchNumber,
      c.plantCode,
      c.severity,
      `"${c.category}"`,
      c.status,
      c.createdAt.split('T')[0]
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TooYumm_CRM_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper: SVG Pie Generator
  const renderPie = (slices: ChartSlice[], chartId: string) => {
    let accumulatedAngle = 0;
    const total = slices.reduce((acc, s) => acc + s.value, 0);

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* SVG Circle */}
        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
          <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {slices.map((slice, i) => {
              const portion = slice.value / total;
              const startAngle = accumulatedAngle;
              const endAngle = accumulatedAngle + portion * 2 * Math.PI;
              accumulatedAngle = endAngle;

              const x1 = Math.cos(startAngle);
              const y1 = Math.sin(startAngle);
              const x2 = Math.cos(endAngle);
              const y2 = Math.sin(endAngle);
              const largeArc = portion > 0.5 ? 1 : 0;

              const pathData = portion >= 0.999 
                ? 'M 0 0 m -1, 0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0'
                : `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`;

              const isHovered = hoveredSlice?.chartId === chartId && hoveredSlice?.label === slice.label;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={slice.color}
                  opacity={isHovered ? 1 : 0.9}
                  stroke="rgba(15, 21, 37, 0.6)"
                  strokeWidth="0.04"
                  onMouseEnter={() => setHoveredSlice({ chartId, label: slice.label, value: slice.value })}
                  onMouseLeave={() => setHoveredSlice(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
          {slices.map((slice, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredSlice({ chartId, label: slice.label, value: slice.value })}
              onMouseLeave={() => setHoveredSlice(null)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '2px 4px',
                borderRadius: '4px',
                background: hoveredSlice?.chartId === chartId && hoveredSlice?.label === slice.label ? 'rgba(255,255,255,0.08)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: slice.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>{slice.label}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#FFF', marginLeft: '6px' }}>{slice.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header matching Screenshot 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFF' }}>
          Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* + New Complain (Red button from Screenshot 4) */}
          <button 
            onClick={onNewComplaintClick}
            className="btn"
            style={{ 
              background: '#DC2626', 
              color: '#FFF', 
              fontWeight: 700, 
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <PlusCircle size={15} />
            <span>+ New Complain</span>
          </button>

          {/* Download Report (Green button from Screenshot 4) */}
          <button 
            onClick={handleDownloadReport}
            className="btn"
            style={{ 
              background: '#10B981', 
              color: '#FFF', 
              fontWeight: 700, 
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Download size={15} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (From Date, To Date, Select Plant, SEARCH from Screenshot 4) */}
      <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(15, 21, 37, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ minWidth: '160px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              From Date
            </label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              To Date
            </label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ minWidth: '220px', flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Select Plant
            </label>
            <select 
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            >
              {plantOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => alert(`Filters applied for: ${selectedPlant} (${fromDate} to ${toDate})`)}
            className="btn"
            style={{ 
              background: '#10B981', 
              color: '#FFF', 
              fontWeight: 700, 
              padding: '9px 24px',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Search size={15} />
            <span>SEARCH</span>
          </button>

        </div>
      </div>

      {/* 3 Top KPI Cards (CLOSED, WORK IN PROGRESS, TOTAL from Screenshot 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Closed Card (Red top border from Screenshot 4) */}
        <div className="glass-panel" style={{ 
          padding: '18px 24px', 
          borderTop: '4px solid #EF4444',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', letterSpacing: '0.05em' }}>
              CLOSED
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {closedCount}
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={22} color="#EF4444" />
          </div>
        </div>

        {/* Work in Progress Card (Green top border from Screenshot 4) */}
        <div className="glass-panel" style={{ 
          padding: '18px 24px', 
          borderTop: '4px solid #10B981',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.05em' }}>
              WORK IN PROGRESS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {wipCount}
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={22} color="#10B981" />
          </div>
        </div>

        {/* Total Complaints Card (Cyan top border from Screenshot 4) */}
        <div className="glass-panel" style={{ 
          padding: '18px 24px', 
          borderTop: '4px solid #06B6D4',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '0.05em' }}>
              TOTAL TICKETS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {totalCount}
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={22} color="#06B6D4" />
          </div>
        </div>

      </div>

      {/* 7 Authentic Charts Grid (from Screenshot 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        
        {/* 1. Customer Connected For */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Customer Connected For
          </div>
          {renderPie(connectedForData, 'connectedFor')}
        </div>

        {/* 2. Product Category Wise Complaint */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Product Category Wise Complaint
          </div>
          {renderPie(categoryWiseData, 'categoryWise')}
        </div>

        {/* 3. Product Wise Complaint */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Product Wise Complaint
          </div>
          {renderPie(productWiseData, 'productWise')}
        </div>

        {/* 4. Customer Response Action Status */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Customer Response Action Status
          </div>
          {renderPie(actionStatusData, 'actionStatus')}
        </div>

        {/* 5. Customer Complaint - Region Wise */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Customer Complaint - Region Wise
          </div>
          {renderPie(regionWiseData, 'regionWise')}
        </div>

        {/* 6. Customer Response Nature */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
            Customer Response Nature
          </div>
          {renderPie(responseNatureData, 'responseNature')}
        </div>

      </div>

      {/* 7. Plant wise Complaint (Wide card matching bottom of Screenshot 4) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px' }}>
          Plant wise Complaint
        </div>
        {renderPie(plantWiseData, 'plantWise')}
      </div>

    </div>
  );
};
