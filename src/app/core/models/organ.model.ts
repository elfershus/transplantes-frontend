import { Donor } from './donor.model';

export interface Organ {
  id?: number;
  type:
    | 'heart'
    | 'liver'
    | 'kidney'
    | 'lung'
    | 'pancreas'
    | 'intestine'
    | 'cornea'
    | 'other';
  donorId: number;
  donor?: Donor;
  retrievalDate: Date;
  expirationDate: Date;
  status: 'available' | 'matched' | 'in_transit' | 'transplanted' | 'expired';
  preservationMethod: string;
  preservationStartTime: Date;
  qualityAssessment: string;
  additionalNotes: string;
  matchedToReceiver?: number;
  condition?: string;
  storageLocation?: string;
  compatibilities?: any[];
  transportations?: any[];
  biometrics: {
    size: string;
    weight: number; // in grams
    condition: string;
  };
  location: {
    institutionId: number;
    department: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  transportationId?: number;
}
