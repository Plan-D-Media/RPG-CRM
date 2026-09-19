import { ProductItem, PlantFacility, ComplaintTicket, OutbreakAlert } from '../types/crm';

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Too Yumm! Karare Chilli Achari',
    category: 'Karare',
    flavor: 'Chilli Achari (Zesty Pickle Punch)',
    packSize: '75g (Family Pack)',
    skuCode: 'TY-KAR-75G-ACH'
  },
  {
    id: 'prod-2',
    name: 'Too Yumm! Karare Munchy Masala',
    category: 'Karare',
    flavor: 'Munchy Masala',
    packSize: '50g',
    skuCode: 'TY-KAR-50G-MSL'
  },
  {
    id: 'prod-3',
    name: 'Too Yumm! Veggie Stix Sour Cream & Onion',
    category: 'Veggie Stix',
    flavor: 'Sour Cream & Onion',
    packSize: '60g',
    skuCode: 'TY-VEG-60G-SCO'
  },
  {
    id: 'prod-4',
    name: 'Too Yumm! Veggie Stix Cheese Herb',
    category: 'Veggie Stix',
    flavor: 'Cheese Herb Delight',
    packSize: '60g',
    skuCode: 'TY-VEG-60G-CHZ'
  },
  {
    id: 'prod-5',
    name: 'Too Yumm! Multigrain Chips Tangy Tomato',
    category: 'Multigrain Chips',
    flavor: 'Tangy Tomato Burst',
    packSize: '85g',
    skuCode: 'TY-MGC-85G-TT'
  },
  {
    id: 'prod-6',
    name: 'Too Yumm! Bhoot Karare Extreme Chilli',
    category: 'Karare',
    flavor: 'Bhoot Jholokia Extreme Hot',
    packSize: '70g',
    skuCode: 'TY-BHT-70G-EXT'
  },
  {
    id: 'prod-7',
    name: 'Too Yumm! Rings Spanish Tomato',
    category: 'Rings',
    flavor: 'Spanish Tomato',
    packSize: '50g',
    skuCode: 'TY-RNG-50G-ST'
  },
  {
    id: 'prod-8',
    name: 'Too Yumm! Namkeen All-in-One Mixture',
    category: 'Namkeen',
    flavor: 'Royal All-in-One Crunch',
    packSize: '150g',
    skuCode: 'TY-NMK-150G-AIO'
  }
];

export const PLANTS_FACILITIES: PlantFacility[] = [
  {
    code: 'HW-01',
    name: 'Haridwar Manufacturing Unit 1',
    location: 'SIDCUL Industrial Area, Haridwar, UK',
    lines: ['Line A (Extrusion)', 'Line B (Roaster & Coating)', 'Line C (Form-Fill-Seal Packaging)'],
    qaHead: 'Dr. Rajesh Sharma (Lead QA)',
    currentPPM: 14.2,
    status: 'Normal'
  },
  {
    code: 'BD-02',
    name: 'Baddi Extrusion & Baking Facility',
    location: 'Solan District, Baddi, HP',
    lines: ['Extruder 1', 'Baking Oven 2', 'High-Speed Multilane Packer 4'],
    qaHead: 'Sunita Verma (Plant QA Manager)',
    currentPPM: 38.6,
    status: 'Warning'
  },
  {
    code: 'HY-03',
    name: 'Hyderabad Southern Mega-Hub',
    location: 'Patancheru IDA, Hyderabad, TS',
    lines: ['Line 1 (Chips Line)', 'Line 2 (Karare Nitrogen Line)', 'Line 3 (Bulk Pack)'],
    qaHead: 'K. Venkatraman (Regional Quality Lead)',
    currentPPM: 8.5,
    status: 'Normal'
  },
  {
    code: 'GN-04',
    name: 'Greater Noida Contract Co-Packer',
    location: 'Ecotech III, Greater Noida, UP',
    lines: ['Line Alpha (Packer)', 'Line Beta (Seasoning Drum)'],
    qaHead: 'Amitabh Sen (CQA Auditor)',
    currentPPM: 24.1,
    status: 'Audit_Due'
  }
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'TY-2026-9812',
    consumerName: 'Arjun Mehta',
    consumerPhone: '+91 98201 44521',
    consumerCity: 'Mumbai',
    consumerState: 'Maharashtra',
    product: PRODUCTS_CATALOG[0],
    batchNumber: 'BD26-M04-K',
    mfgDate: '2026-08-14',
    expiryDate: '2027-02-14',
    plantCode: 'BD-02',
    manufacturingLine: 'High-Speed Multilane Packer 4',
    severity: 'High',
    category: 'Packaging Defect (Seal Leak / Deflated)',
    description: 'Bought 3 packets of Karare Chilli Achari from D-Mart Andheri. Two packets were completely flat with no nitrogen cushion; snacks inside were soggy and lost crispness.',
    photoUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    status: 'CAPA_Generated',
    createdAt: '2026-09-15T10:30:00Z',
    resolutionTimeHours: 18,
    aiVisionAnalysis: {
      detectedDefect: 'Packaging Defect (Seal Leak / Deflated)',
      confidenceScore: 0.96,
      annotatedFeatures: ['Micro-puncture detected at top cross-seal', 'Zero nitrogen gas volume', 'Foil barrier crease anomaly'],
      extractedBatch: 'BD26-M04-K',
      extractedMfgDate: '14/08/2026',
      extractedExpiry: '14/02/2027',
      extractedPlantCode: 'BD-02',
      recommendation: 'Correlate with Baddi Packer 4 heat-seal jaw temperature logs between 14:00-16:00.'
    },
    capa: {
      d1_team: ['Sunita Verma (QA)', 'Ramesh Yadav (Maintenance Head)', 'Vikas Pal (Line Supervisor)'],
      d2_problemDescription: 'Cross-seal micro leakage causing loss of nitrogen barrier and premature staling in 75g Karare pouches.',
      d3_containmentAction: 'Quarantine 480 cartons of Batch BD26-M04-K at Bhiwandi Central Depot. Conduct 100% water-dip leak check on retention samples.',
      d4_rootCause5Why: [
        { why: 'Why did the cross seal fail?', answer: 'Sealing jaw contact temperature dropped below 165°C spec.' },
        { why: 'Why did the temperature drop?', answer: 'Heating cartridge resistance element burned out intermittently.' },
        { why: 'Why was the resistance drop not flagged?', answer: 'Thermocouple placement was measuring the upper block rather than the contact tip.' },
        { why: 'Why was thermocouple misplaced?', answer: 'Replaced during emergency changeover without recalibration.' },
        { why: 'Root Cause?', answer: 'Lack of post-maintenance thermal imaging validation protocol on Multilane Packer 4.' }
      ],
      d5_correctiveAction: 'Replaced heating cartridge with dual-zone ceramic heater; installed real-time infrared seal temperature sensor with automatic pouch-reject solenoid.',
      d6_verificationMetric: 'Zero leak failures across 15,000 pouches tested during 48-hour continuous production run.',
      d7_preventiveMaintenance: 'Updated SOP-PKG-402 to mandate FLIR thermal scan after any heater element replacement.',
      d8_teamRecognition: 'Maintenance and QA shift team awarded Golden Quality Star.',
      aiConfidence: 0.94,
      estimatedResolutionHrs: 24
    },
    plantRemarks: 'Sample inspected at Baddi laboratory. Water immersion bubble test confirmed 0.2mm pinhole at top right serration.',
    cqaNotes: 'CQA approves CAPA closure. Baddi Plant score restored to 94.5%.',
    compensationVoucher: {
      code: 'TY-SORRY-CRUNCH-884',
      amount: 250,
      status: 'Issued'
    }
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TY-2026-9844',
    consumerName: 'Pooja Iyer',
    consumerPhone: '+91 97412 88210',
    consumerCity: 'Bengaluru',
    consumerState: 'Karnataka',
    product: PRODUCTS_CATALOG[2],
    batchNumber: 'HY26-S12-V',
    mfgDate: '2026-09-02',
    expiryDate: '2027-03-02',
    plantCode: 'HY-03',
    manufacturingLine: 'Line 2 (Karare Nitrogen Line)',
    severity: 'Medium',
    category: 'Seasoning Imbalance / Missing Spices',
    description: 'Veggie Stix Sour Cream tasted very bland, almost zero seasoning dust on the sticks. Very disappointing as my kids love this flavor.',
    photoUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    status: 'Plant_Investigation',
    createdAt: '2026-09-16T14:15:00Z',
    aiVisionAnalysis: {
      detectedDefect: 'Seasoning Imbalance / Missing Spices',
      confidenceScore: 0.91,
      annotatedFeatures: ['Surface color RGB variance is 32% lower than golden standard', 'Sparse particulate distribution', 'Tumbler coating deficit'],
      extractedBatch: 'HY26-S12-V',
      extractedMfgDate: '02/09/2026',
      extractedExpiry: '02/03/2027',
      extractedPlantCode: 'HY-03',
      recommendation: 'Inspect seasoning feed hopper auger RPM logs at Hyderabad Line 2.'
    },
    plantRemarks: 'Retention sample batch retrieved. Weighment shows 5.8% seasoning level against standard 8.5%. Investigating auger motor slip.',
    compensationVoucher: {
      code: 'TY-SNACKBOX-150',
      amount: 150,
      status: 'Issued'
    }
  },
  {
    id: 'tkt-103',
    ticketNumber: 'TY-2026-9870',
    consumerName: 'Rajeshwar Chawla',
    consumerPhone: '+91 98110 54329',
    consumerCity: 'New Delhi',
    consumerState: 'Delhi NCR',
    product: PRODUCTS_CATALOG[5],
    batchNumber: 'BD26-M04-K',
    mfgDate: '2026-08-14',
    expiryDate: '2027-02-14',
    plantCode: 'BD-02',
    manufacturingLine: 'High-Speed Multilane Packer 4',
    severity: 'Critical',
    category: 'Burnt / Overcooked / Color Anomaly',
    description: 'Found dark, charred, rock-hard clumps inside Bhoot Karare packet. Smelled like scorched oil. Unfit for consumption!',
    photoUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
    status: 'Escalated',
    createdAt: '2026-09-17T08:20:00Z',
    aiVisionAnalysis: {
      detectedDefect: 'Burnt / Overcooked / Color Anomaly',
      confidenceScore: 0.98,
      annotatedFeatures: ['Carbonized mass detected (>45% blackened area)', 'High pyrolysis risk', 'Overheated roaster accumulation'],
      extractedBatch: 'BD26-M04-K',
      extractedMfgDate: '14/08/2026',
      extractedExpiry: '14/02/2027',
      extractedPlantCode: 'BD-02',
      recommendation: 'CRITICAL: Second severe complaint for batch BD26-M04-K. Trigger automatic CQA recall risk evaluation.'
    },
    plantRemarks: 'Sample expedited via courier to CQA Central Lab in Kolkata.',
    cqaNotes: 'ESCALATION LEVEL 2: Batch BD26-M04-K has multi-defect convergence (Seal Leak in Mumbai + Charred Clumps in Delhi). Recall committee alerted.',
    compensationVoucher: {
      code: 'TY-PRIME-CARE-500',
      amount: 500,
      status: 'Pending'
    }
  },
  {
    id: 'tkt-104',
    ticketNumber: 'TY-2026-9892',
    consumerName: 'Sneha Sengupta',
    consumerPhone: '+91 94330 19283',
    consumerCity: 'Kolkata',
    consumerState: 'West Bengal',
    product: PRODUCTS_CATALOG[4],
    batchNumber: 'HW26-T22-M',
    mfgDate: '2026-09-08',
    expiryDate: '2027-03-08',
    plantCode: 'HW-01',
    manufacturingLine: 'Line B (Roaster & Coating)',
    severity: 'Low',
    category: 'Underweight / Net Content Discrepancy',
    description: '85g Tangy Tomato pack weighed only 76g on kitchen digital scale. Just reporting for quality checking.',
    photoUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
    status: 'Resolved',
    createdAt: '2026-09-12T16:40:00Z',
    resolutionTimeHours: 12,
    aiVisionAnalysis: {
      detectedDefect: 'Underweight / Net Content Discrepancy',
      confidenceScore: 0.89,
      annotatedFeatures: ['Weight indicator shows 76.2g', 'Tare offset within statistical margin of single head weigher'],
      extractedBatch: 'HW26-T22-M',
      extractedMfgDate: '08/09/2026',
      extractedExpiry: '08/03/2027',
      extractedPlantCode: 'HW-01',
      recommendation: 'Calibrate multi-head weigher bucket #7 on Line B.'
    },
    plantRemarks: 'Weigher Head 7 load cell zeroed and re-calibrated. Retention samples average 86.2g.',
    cqaNotes: 'Within FSSAI legal metrology tolerance (maximum permissible error). Case closed with courteous explanation & gift coupon to consumer.',
    compensationVoucher: {
      code: 'TY-LOYAL-100',
      amount: 100,
      status: 'Redeemed'
    }
  }
];

export const ACTIVE_OUTBREAKS: OutbreakAlert[] = [
  {
    id: 'outbreak-1',
    batchNumber: 'BD26-M04-K',
    productName: 'Too Yumm! Karare Chilli Achari (75g)',
    plantCode: 'BD-02 (Baddi Facility)',
    incidentCount: 5,
    affectedCities: ['Mumbai', 'New Delhi', 'Pune', 'Jaipur'],
    riskScore: 88,
    recommendation: 'Batch Hold',
    detectedAt: '2026-09-17T08:35:00Z'
  },
  {
    id: 'outbreak-2',
    batchNumber: 'HY26-S12-V',
    productName: 'Too Yumm! Veggie Stix Sour Cream & Onion',
    plantCode: 'HY-03 (Hyderabad Facility)',
    incidentCount: 2,
    affectedCities: ['Bengaluru', 'Chennai'],
    riskScore: 34,
    recommendation: 'Plant Line Inspection',
    detectedAt: '2026-09-16T19:00:00Z'
  }
];

export const SAMPLE_DEFECT_SCENARIOS = [
  {
    title: 'Sealing Puncture / Deflated Karare',
    product: PRODUCTS_CATALOG[0],
    batch: 'BD26-M04-K',
    plant: 'BD-02',
    severity: 'High' as const,
    category: 'Packaging Defect (Seal Leak / Deflated)' as const,
    description: 'Bag was completely limp without nitrogen air cushion. Snacks inside became soft and lost typical crunch within minutes.',
    imgUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    features: ['Top transverse heat seal 0.3mm micro channel', 'Gas pressure: 0.0 kPa (expected 18 kPa)', 'Foil delamination at notch']
  },
  {
    title: 'Foreign Particle / Scorched Clump',
    product: PRODUCTS_CATALOG[5],
    batch: 'BD26-M04-K',
    plant: 'BD-02',
    severity: 'Critical' as const,
    category: 'Burnt / Overcooked / Color Anomaly' as const,
    description: 'Found hard black carbonized residue adhered to snack piece. Pungent smoke aroma.',
    imgUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
    features: ['Over-roasted clump (>350°C localized exposure)', 'Metal detector pass (non-metallic organic mass)', 'Roaster baffle drop-off']
  },
  {
    title: 'Underweight Veggie Stix (60g Pack)',
    product: PRODUCTS_CATALOG[2],
    batch: 'HW26-T22-M',
    plant: 'HW-01',
    severity: 'Medium' as const,
    category: 'Underweight / Net Content Discrepancy' as const,
    description: 'Felt very light. Digital scale showed 46g instead of declared 60g net weight.',
    imgUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
    features: ['Scale reading 46.4g gross', 'Single feeder hopper dump starved', 'Multi-head checkweigher reject gate misfire']
  }
];
