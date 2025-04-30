export interface Receiver {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  bloodType: string;
  gender: string;
  organNeeded: string;
  urgencyLevel: number; // 1-5, with 5 being most urgent
  waitingSince: Date;
  healthStatus: string;
  medicalHistory: string;
  diagnosisDetails: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  insuranceDetails: string;
  assignedDoctor: number; // Doctor ID
  assignedInstitution: number; // Institution ID
  compatibilityFactors: {
    hlaType: string;
    antibodies: string[];
    tissueType: string;
  };
  status: 'waiting' | 'matched' | 'transplanted' | 'inactive';
  medicalId?: string;
  clinicHistory?: {
    medicalHistory?: string;
    allergies?: string;
    currentMedications?: string;
    previousSurgeries?: string;
    laboratoryResults?: any;
    imagingResults?: any;
  };
  compatibilities?: any[];
  procedures?: any[];
  hlaType?: string;
  urgencyStatus?: number;
  registrationDate?: Date;
}
