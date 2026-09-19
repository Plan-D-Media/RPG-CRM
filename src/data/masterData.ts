import { MasterItem, BreakdownLog, InternalComplaint } from '../types/crmExtended';

export const INITIAL_MASTERS: MasterItem[] = [
  // Regions
  { id: 'reg-1', category: 'Region', name: 'South', code: 'REG-S', status: 'Active' },
  { id: 'reg-2', category: 'Region', name: 'North', code: 'REG-N', status: 'Active' },
  { id: 'reg-3', category: 'Region', name: 'West', code: 'REG-W', status: 'Active' },
  { id: 'reg-4', category: 'Region', name: 'East', code: 'REG-E', status: 'Active' },

  // Complaint Sources
  { id: 'src-1', category: 'Complaint Source', name: 'Toll-Free Customer Care', code: 'SRC-TF', status: 'Active' },
  { id: 'src-2', category: 'Complaint Source', name: 'WhatsApp Business Support', code: 'SRC-WA', status: 'Active' },
  { id: 'src-3', category: 'Complaint Source', name: 'Email Support (feedback@rp-sg.in)', code: 'SRC-EM', status: 'Active' },
  { id: 'src-4', category: 'Complaint Source', name: 'Retailer & Distributor Return', code: 'SRC-RET', status: 'Active' },
  { id: 'src-5', category: 'Complaint Source', name: 'Social Media (Twitter/X & Instagram)', code: 'SRC-SOC', status: 'Active' },
  { id: 'src-6', category: 'Complaint Source', name: 'Field Sales Representative App', code: 'SRC-FSR', status: 'Active' },

  // Product Categories
  { id: 'pcat-1', category: 'Product Category', name: 'Potato Chips', code: 'CAT-PC', status: 'Active' },
  { id: 'pcat-2', category: 'Product Category', name: 'Extruded Snacks (Karare & Stix)', code: 'CAT-EXT', status: 'Active' },
  { id: 'pcat-3', category: 'Product Category', name: 'Indian Ethnic (Namkeen)', code: 'CAT-ETH', status: 'Active' },
  { id: 'pcat-4', category: 'Product Category', name: 'Noodles & Instant Bites', code: 'CAT-NDL', status: 'Active' },
  { id: 'pcat-5', category: 'Product Category', name: 'Premium Gourmet Chips', code: 'CAT-PRM', status: 'Active' },

  // Product Names
  { id: 'pname-1', category: 'Product Name', name: 'Too Yumm! Karare', code: 'PRD-KAR', status: 'Active' },
  { id: 'pname-2', category: 'Product Name', name: 'Too Yumm! Potato Chips', code: 'PRD-PC', status: 'Active' },
  { id: 'pname-3', category: 'Product Name', name: 'Too Yumm! Veggie Stix', code: 'PRD-VEG', status: 'Active' },
  { id: 'pname-4', category: 'Product Name', name: 'Too Yumm! Multigrain Chips', code: 'PRD-MGC', status: 'Active' },
  { id: 'pname-5', category: 'Product Name', name: 'Too Yumm! Bikaneri Bhujia', code: 'PRD-BB', status: 'Active' },
  { id: 'pname-6', category: 'Product Name', name: 'Too Yumm! Salted Peanut', code: 'PRD-SP', status: 'Active' },
  { id: 'pname-7', category: 'Product Name', name: 'Too Yumm! Tasty Nut', code: 'PRD-TN', status: 'Active' },
  { id: 'pname-8', category: 'Product Name', name: 'Too Yumm! All-In-One Mixture', code: 'PRD-AIO', status: 'Active' },

  // Product Flavours
  { id: 'pflv-1', category: 'Product Flavour', name: 'Chilli Achari (Zesty Pickle Punch)', code: 'FLV-ACH', status: 'Active' },
  { id: 'pflv-2', category: 'Product Flavour', name: 'Munchy Masala', code: 'FLV-MSL', status: 'Active' },
  { id: 'pflv-3', category: 'Product Flavour', name: 'Sour Cream & Onion', code: 'FLV-SCO', status: 'Active' },
  { id: 'pflv-4', category: 'Product Flavour', name: 'Spanish Tomato', code: 'FLV-ST', status: 'Active' },
  { id: 'pflv-5', category: 'Product Flavour', name: 'Bhoot Karare Extreme Chilli', code: 'FLV-BHT', status: 'Active' },
  { id: 'pflv-6', category: 'Product Flavour', name: 'Cream & Herbs', code: 'FLV-CH', status: 'Active' },
  { id: 'pflv-7', category: 'Product Flavour', name: 'Tangy Tomato', code: 'FLV-TT', status: 'Active' },

  // Plant Names (from Screenshot 4)
  { id: 'plt-1', category: 'Plant Name', name: 'Geeta Snacks & Savouries', code: 'PLT-GEETA', status: 'Active' },
  { id: 'plt-2', category: 'Plant Name', name: 'GKP Snacks Industries', code: 'PLT-GKP', status: 'Active' },
  { id: 'plt-3', category: 'Plant Name', name: 'Pampar Foods Pvt Ltd', code: 'PLT-PAMPAR', status: 'Active' },
  { id: 'plt-4', category: 'Plant Name', name: 'Badshah Extrusion Plant', code: 'PLT-BADSHAH', status: 'Active' },
  { id: 'plt-5', category: 'Plant Name', name: 'Atop Foods Co-Packer', code: 'PLT-ATOP', status: 'Active' },
  { id: 'plt-6', category: 'Plant Name', name: 'Patwari Foods Facility', code: 'PLT-PATWARI', status: 'Active' },
  { id: 'plt-7', category: 'Plant Name', name: 'GRTS Manufacturing Hub', code: 'PLT-GRTS', status: 'Active' },
  { id: 'plt-8', category: 'Plant Name', name: 'Devarpan Foods Ltd', code: 'PLT-DEVARPAN', status: 'Active' },
  { id: 'plt-9', category: 'Plant Name', name: 'Haridwar SIDCUL Unit 1', code: 'PLT-HW01', status: 'Active' },
  { id: 'plt-10', category: 'Plant Name', name: 'Baddi Extrusion Unit 2', code: 'PLT-BD02', status: 'Active' },

  // Responses
  { id: 'rsp-1', category: 'Response', name: 'Replacement Pack Delivered + Courier Follow-up', code: 'RSP-RPL', status: 'Active' },
  { id: 'rsp-2', category: 'Response', name: 'Digital Goodwill Snack Coupon (₹250)', code: 'RSP-VOU', status: 'Active' },
  { id: 'rsp-3', category: 'Response', name: 'Technical QA Explanation Letter Provided', code: 'RSP-EXP', status: 'Active' },
  { id: 'rsp-4', category: 'Response', name: 'Consumer Visit by Regional QA Officer', code: 'RSP-VIS', status: 'Active' },

  // Complaint Categories (from Screenshot 4)
  { id: 'ccat-1', category: 'Complaint Category', name: 'Product Quality (Sensorial Characteristics)', code: 'CCAT-SEN', status: 'Active' },
  { id: 'ccat-2', category: 'Complaint Category', name: 'Food Safety & Hygiene', code: 'CCAT-FS', status: 'Active' },
  { id: 'ccat-3', category: 'Complaint Category', name: 'Packaging & Barrier Integrity', code: 'CCAT-PKG', status: 'Active' },
  { id: 'ccat-4', category: 'Complaint Category', name: 'Legal Metrology & Weight Discrepancy', code: 'CCAT-LEG', status: 'Active' },

  // Complaint Sub Categories
  { id: 'csub-1', category: 'Complaint Sub Category', name: 'Seal Leak / Pouch Deflation', code: 'CSUB-SEAL', status: 'Active' },
  { id: 'csub-2', category: 'Complaint Sub Category', name: 'Burnt / Overcooked / Carbonized Clump', code: 'CSUB-BRN', status: 'Active' },
  { id: 'csub-3', category: 'Complaint Sub Category', name: 'Underweight Net Content (< declared weight)', code: 'CSUB-WT', status: 'Active' },
  { id: 'csub-4', category: 'Complaint Sub Category', name: 'Missing or Uneven Seasoning Dust', code: 'CSUB-SSN', status: 'Active' },
  { id: 'csub-5', category: 'Complaint Sub Category', name: 'Off-Odor / Oil Rancidity', code: 'CSUB-RNC', status: 'Active' },
  { id: 'csub-6', category: 'Complaint Sub Category', name: 'Foreign Particle / Contaminant', code: 'CSUB-FPT', status: 'Active' },
  { id: 'csub-7', category: 'Complaint Sub Category', name: 'Puffiness / Micro-organism Gas Swelling', code: 'CSUB-PUF', status: 'Active' },

  // Complaint Status
  { id: 'cst-1', category: 'Complaint Status', name: 'Closed', code: 'ST-CLS', status: 'Active' },
  { id: 'cst-2', category: 'Complaint Status', name: 'Work in Progress (WIP)', code: 'ST-WIP', status: 'Active' },
  { id: 'cst-3', category: 'Complaint Status', name: 'Logged / New', code: 'ST-LOG', status: 'Active' },
  { id: 'cst-4', category: 'Complaint Status', name: 'Escalated to CQA', code: 'ST-ESC', status: 'Active' }
];

export const INITIAL_BREAKDOWNS: BreakdownLog[] = [
  {
    id: 'bk-101',
    logNumber: 'BRK-2026-041',
    plantName: 'GKP Snacks Industries',
    lineName: 'Line 2 (High-Speed Karare Packer)',
    equipmentName: 'Form-Fill-Seal Sealing Jaw Assembly',
    breakdownType: 'Electrical',
    startTime: '2026-09-16 08:30',
    endTime: '2026-09-16 10:15',
    downtimeMinutes: 105,
    rootCause: 'Heating cartridge terminal wire loose connection leading to intermittent temperature drops below 160°C.',
    actionTaken: 'Crimped heat-resistant ceramic lugs, replaced heater cartridge, tested with digital pyrometer.',
    technicianName: 'S. K. Verma (Senior Electrical Tech)',
    aiDiagnosticSuggestion: 'High probability of thermal cycling fatigue. Recommended switching to high-temperature nickel-braided wiring harness to prevent 35-day failure cycle.',
    status: 'Resolved'
  },
  {
    id: 'bk-102',
    logNumber: 'BRK-2026-042',
    plantName: 'Pampar Foods Pvt Ltd',
    lineName: 'Line A (Roasting & Baking Conveyor)',
    equipmentName: 'Air Knife Blower Motor #3',
    breakdownType: 'Mechanical',
    startTime: '2026-09-17 06:00',
    endTime: '2026-09-17 07:45',
    downtimeMinutes: 105,
    rootCause: 'Bearing seizure due to seasoning spice particulate ingress past outer seal ring.',
    actionTaken: 'Disassembled blower housing, pressed new SKF sealed bearing, replaced labyrinth seal.',
    technicianName: 'Rameshwar Pal',
    aiDiagnosticSuggestion: 'Bearing vibration telemetry reached 4.8 mm/s before seizure. Install IP65 rated dust-exclusion seals.',
    status: 'Resolved'
  },
  {
    id: 'bk-103',
    logNumber: 'BRK-2026-043',
    plantName: 'Badshah Extrusion Plant',
    lineName: 'Extruder Line 1',
    equipmentName: 'Twin Screw Feed Hopper Auger',
    breakdownType: 'Pneumatic',
    startTime: '2026-09-17 14:20',
    endTime: '2026-09-17 15:10',
    downtimeMinutes: 50,
    rootCause: 'Pneumatic vibrator solenoid valve clogged with dried flour slurry.',
    actionTaken: 'Cleaned solenoid spool, installed in-line moisture coalescing air filter.',
    technicianName: 'Mohd. Imran',
    aiDiagnosticSuggestion: 'Check compressor receiver dew point. High moisture in pneumatic ring main flagged.',
    status: 'Resolved'
  }
];

export const INITIAL_INTERNAL_COMPLAINTS: InternalComplaint[] = [
  {
    id: 'int-201',
    internalTicketNumber: 'INT-QA-2026-088',
    plantName: 'Geeta Snacks & Savouries',
    lineName: 'Line 1 (Potato Chips Frying)',
    productName: 'Too Yumm! Potato Chips Classic Salted',
    batchNumber: 'GT26-P09-C',
    sampleTime: '2026-09-17 11:30',
    inspectionStage: 'Frying / Baking',
    defectType: 'Dark Edge Frying / Caramelized Sugar Discoloration',
    quantityHeldKg: 350,
    dispositionStatus: 'Scrap Quarantine',
    qcInspector: 'Sunita Roy (Shift QA)',
    remarks: 'Incoming potato lot had reducing sugar >0.25%, causing rapid browning in frying zone. Fryer temperature lowered and balance lot rejected to cold storage.',
    createdAt: '2026-09-17T11:45:00Z'
  },
  {
    id: 'int-202',
    internalTicketNumber: 'INT-QA-2026-089',
    plantName: 'Atop Foods Co-Packer',
    lineName: 'Line Beta (Multigrain Extrusion)',
    productName: 'Too Yumm! Multigrain Chips Tangy Tomato',
    batchNumber: 'AT26-M11-T',
    sampleTime: '2026-09-17 15:10',
    inspectionStage: 'Packaging / Sealing',
    defectType: 'Nitrogen Gas Pressure Low (<12 kPa target)',
    quantityHeldKg: 180,
    dispositionStatus: 'Rework',
    qcInspector: 'Vipin Sharma (Plant Lead)',
    remarks: 'Nitrogen gas generator secondary bank pressure regulator drifted. 300 pouches unsealed and recycled through secondary hopper.',
    createdAt: '2026-09-17T15:25:00Z'
  }
];
