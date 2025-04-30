export interface ClinicHistory {
  id?: number;
  patientId: number; // Can be either donor or receiver ID
  patientType: 'donor' | 'receiver';
  medicalRecordNumber: string;
  visits: ClinicVisit[];
  diagnoses: Diagnosis[];
  medications: Medication[];
  allergies: string[];
  immunizations: Immunization[];
  familyHistory: string;
  surgicalHistory: Surgery[];
  labResults: LabResult[];
  imagingResults: ImagingResult[];
  primaryPhysician: number; // Doctor ID
}

export interface ClinicVisit {
  id?: number;
  date: Date;
  doctorId: number;
  institutionId: number;
  reason: string;
  notes: string;
  followUpNeeded: boolean;
  followUpDate?: Date;
}

export interface Diagnosis {
  id?: number;
  condition: string;
  diagnosisDate: Date;
  diagnosedBy: number; // Doctor ID
  status: 'active' | 'resolved' | 'managed';
  notes: string;
}

export interface Medication {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: number; // Doctor ID
  purpose: string;
  isActive: boolean;
}

export interface Immunization {
  id?: number;
  type: string;
  date: Date;
  administeredAt: number; // Institution ID
  administeredBy: number; // Doctor ID
  lotNumber: string;
  notes: string;
}

export interface Surgery {
  id?: number;
  procedureType: string;
  date: Date;
  surgeon: number; // Doctor ID
  facility: number; // Institution ID
  outcome: string;
  complications: string[];
  notes: string;
}

export interface LabResult {
  id?: number;
  testType: string;
  date: Date;
  results: string;
  normalRange: string;
  isAbnormal: boolean;
  orderedBy: number; // Doctor ID
  performedAt: number; // Institution ID
  notes: string;
}

export interface ImagingResult {
  id?: number;
  imagingType: string;
  date: Date;
  findings: string;
  impressions: string;
  orderedBy: number; // Doctor ID
  performedAt: number; // Institution ID
  fileUrl?: string;
}
