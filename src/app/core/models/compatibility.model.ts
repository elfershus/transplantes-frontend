import { Organ } from './organ.model';
import { Receiver } from './receiver.model';

export interface Compatibility {
  id?: number;
  organId: number;
  receiverId: number;
  donorId: number;
  matchScore: number; // 0-100 percentage
  bloodTypeCompatible: boolean;
  tissueTypeCompatible: boolean;
  sizeCompatible: boolean;
  antibodyCompatible: boolean;
  geographicDistance: number; // in kilometers
  estimatedTransportTime: number; // in minutes
  organPreservationTime: number; // in minutes
  riskFactors: string[];
  notes: string;
  matchDate: Date;
  matchStatus: 'potential' | 'confirmed' | 'rejected' | 'transplanted';
  approvedBy?: number; // Doctor ID
  priority: number; // Priority score for organ allocation
  hlaMatch?: string | number;
  crossMatchResult?: string;

  // Missing properties referenced in code
  status?: string;
  compatibilityScore?: number;
  organ?: Organ;
  receiver?: Receiver;
}
