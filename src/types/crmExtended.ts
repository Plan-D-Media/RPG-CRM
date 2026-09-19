export type NavigationPage = 
  | 'Dashboard'
  | 'Add_Complaint'
  | 'View_All_Complaint'
  | 'Add_Breakdown'
  | 'View_All_Breakdown'
  | 'Add_Internal_Complaint'
  | 'View_All_Internal_Complaint'
  | 'Masters';

export type MasterCategoryType = 
  | 'Region'
  | 'Complaint Source'
  | 'Product Category'
  | 'Product Name'
  | 'Product Flavour'
  | 'Plant Name'
  | 'Response'
  | 'Complaint Category'
  | 'Complaint Sub Category'
  | 'Complaint Status';

export interface MasterItem {
  id: string;
  category: MasterCategoryType;
  name: string;
  code?: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface BreakdownLog {
  id: string;
  logNumber: string;
  plantName: string;
  lineName: string;
  equipmentName: string;
  breakdownType: 'Electrical' | 'Mechanical' | 'Pneumatic' | 'Instrumentation' | 'Operational';
  startTime: string;
  endTime: string;
  downtimeMinutes: number;
  rootCause: string;
  actionTaken: string;
  technicianName: string;
  aiDiagnosticSuggestion?: string;
  status: 'Resolved' | 'Under Observation' | 'Critical Pending';
}

export interface InternalComplaint {
  id: string;
  internalTicketNumber: string;
  plantName: string;
  lineName: string;
  productName: string;
  batchNumber: string;
  sampleTime: string;
  inspectionStage: 'Pre-Extrusion' | 'Frying / Baking' | 'Tumbler Coating' | 'Packaging / Sealing' | 'Finished Goods Hold';
  defectType: string;
  quantityHeldKg: number;
  dispositionStatus: 'Rework' | 'Scrap Quarantine' | 'Released on Concession' | 'Lab Testing';
  qcInspector: string;
  remarks: string;
  createdAt: string;
}
