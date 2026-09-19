export type UserRole = 'Customer' | 'Plant' | 'CQA';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Logged' | 'AI_Triaged' | 'Plant_Investigation' | 'CAPA_Generated' | 'CQA_Reviewed' | 'Resolved' | 'Escalated';

export type DefectCategory = 
  | 'Packaging Defect (Seal Leak / Deflated)'
  | 'Foreign Matter / Contaminant'
  | 'Burnt / Overcooked / Color Anomaly'
  | 'Taste / Rancidity / Oil Off-Odor'
  | 'Underweight / Net Content Discrepancy'
  | 'Seasoning Imbalance / Missing Spices'
  | 'Puffiness / Gas Swelling';

export interface ProductItem {
  id: string;
  name: string;
  category: 'Karare' | 'Veggie Stix' | 'Potato Stix' | 'Multigrain Chips' | 'Rings' | 'Namkeen';
  flavor: string;
  packSize: string;
  skuCode: string;
}

export interface PlantFacility {
  code: string;
  name: string;
  location: string;
  lines: string[];
  qaHead: string;
  currentPPM: number;
  status: 'Normal' | 'Warning' | 'Audit_Due';
}

export interface DefectVisionAnalysis {
  detectedDefect: DefectCategory;
  confidenceScore: number;
  annotatedFeatures: string[];
  extractedBatch: string;
  extractedMfgDate: string;
  extractedExpiry: string;
  extractedPlantCode: string;
  recommendation: string;
}

export interface CAPA8D {
  d1_team: string[];
  d2_problemDescription: string;
  d3_containmentAction: string;
  d4_rootCause5Why: { why: string; answer: string }[];
  d5_correctiveAction: string;
  d6_verificationMetric: string;
  d7_preventiveMaintenance: string;
  d8_teamRecognition: string;
  aiConfidence: number;
  estimatedResolutionHrs: number;
}

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  consumerName: string;
  consumerPhone: string;
  consumerCity: string;
  consumerState: string;
  product: ProductItem;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  plantCode: string;
  manufacturingLine: string;
  severity: SeverityLevel;
  category: DefectCategory;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  createdAt: string;
  aiVisionAnalysis?: DefectVisionAnalysis;
  capa?: CAPA8D;
  plantRemarks?: string;
  cqaNotes?: string;
  resolutionTimeHours?: number;
  compensationVoucher?: {
    code: string;
    amount: number;
    status: 'Issued' | 'Redeemed' | 'Pending';
  };
}

export interface OutbreakAlert {
  id: string;
  batchNumber: string;
  productName: string;
  plantCode: string;
  incidentCount: number;
  affectedCities: string[];
  riskScore: number; // 0-100
  recommendation: 'Batch Hold' | 'Voluntary Quarantine' | 'Plant Line Inspection' | 'Monitor Closely';
  detectedAt: string;
}
